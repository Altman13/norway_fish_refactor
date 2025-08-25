import AbstractView from "../../views/AbstractView.js";
import {observer} from "../../utils/observer/observer.js";
import {findElement} from "../utils/managmentDOM/controlElement.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";
import {createFisPage} from "../../utils/rebuild/createFisPage.js";
import {setFlagsToSend} from "../utils/flags/setFlagsToSend.js";
import {templateDcaReady, templateMainBtn} from "../fis/utils/templatesFis.js";
import {templateDca} from "../fis/utils/components/components.js";
import {buildFinalMsg} from "../fis/utils/buildFinalMsg.js";

let fisHal;
let dcaData;

const dca = () => {
    const dc = document.querySelector('.dynamic-content');

    const createNewDca = () => {
        const operations = [];
        if (fisHal.length) {
            fisHal.forEach(fis => {
                if (!fis.isDca) {
                    operations.push(fis);
                }
            });
        }

        if (operations.length) {
            createFisPage(dc, operations, 'beforeend');
            const createNewDca = findElement('.insert-new-dca');

            document.querySelectorAll('.fis-operation')
                .forEach(el => {
                    createNewDca.append(el);
                });

            findElement('.btn-reg-out').style.display = 'none';
            const send = findElement('.btn-send-out-fis');
            send.textContent = 'Send dca';

            send.onclick = () => {
                //buildFinalMsg('DCA', operations);
                //console.log('operations', JSON.stringify(operations) )

                const finalMsg = {

                    'data': {
                        'TM': 'DCA',
                        'RC': 'RCSIG27',
                        'AC': 'STE',
                        'data': operations
                    }
                }
                    flags: setFlagsToSend(true),
                
                buildFinalMsg('DCA', finalMsg);
                
                //console.log(finalMsg)

                //useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                //     .then(data => console.log(data));

                //findElement('.global-cancel-btn').click();
                console.log('history back')
                window.history.back();
            }
        }
    }

    const createNewDcaBlockA = () => {
        dc.insertAdjacentHTML('beforeend', templateMainBtn());
        const btn = findElement('.btn-reg-out');
        if (btn) {
            btn.style.display = 'none';
        }
        const send = findElement('.btn-send-out-fis');
        send.textContent = 'Send dca';

        send.onclick = () => {
            buildFinalMsg('DCA', { AC: 'STE', QI: '1', EXIT: '1'});
        }
        console.log('Send block A');
    }

    const logicDca = () => {
        localStorage.removeItem('dca');
        if (fisHal.length) {
            if (fisHal[0].status === 'READY') {
                createNewDca();
            } else if (fisHal[0].status === 'INACTIVE') {
                console.log('Сначала завершить операцию');
            }
        } else {
            createNewDcaBlockA();
        }

        if (dcaData?.length) {
            dcaData.forEach(dca => {
                if (dca && dca.RET && dca.RET[dca?.RET.length - 1].RE !== '511') {
                    findElement('.insert-old-dca')
                        .insertAdjacentHTML('beforeend',
                            templateDcaReady({id: dca._id, type: dca.type, date: dca.stm32.DATI}));
                }
            });

            window.onclick = async (e) => {
                const event = e ? e.target : window.event;
                const id = event.id;

                if (event.classList[0] === `DCA-${id}`) {
                    if (id) {
                        dcaData.forEach(dca => {
                            if (+dca._id === +id) {
                                localStorage.dca = JSON.stringify(dca);
                            }
                        });
                    }
                }
            }
        }
    }

    observer(dc, logicDca);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('DCA');
    }

    getData = async () => {
        fisHal = await useHttp(`${state.url}/api/fis/check-fis`);
        dcaData = await useHttp(`${state.url}/api/fis/check-dca`);
       const dca = await useHttp(`${state.url}/api/main/checking-status`, 'POST', { type: 'DCA' });
        console.log('lastDep', dca)
        return '';
    }

    getHtml = async () =>
        `
        ${await this.getData()}
        ${dca()}
        ${templateDca({id: 0, title: 'dca'})}
    `

}