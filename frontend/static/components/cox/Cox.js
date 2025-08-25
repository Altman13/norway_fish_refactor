import { displayAckMsg } from '../../utils/displayAckMsg.js';
import { observer } from '../../utils/observer/observer.js';
import { printData } from '../../utils/printData.js';
import { state } from '../../utils/state/state.js';
import { useHttp } from '../../utils/useHttp.js';
import AbstractView from '../../views/AbstractView.js';
import { printDataTemp, templateSystemBusyModal } from '../dep/Dep.js';
import { closerAccordion } from '../fis/utils/accordionManager/closerAccordion.js';
import { uCreateNewBlock } from '../fis/utils/builder/loopBuilder.js';
import { toDate } from '../submenu/utils/toDate.js';
import { displaySelection } from '../utils/displaySelection.js';
import { setFlagsToSend } from '../utils/flags/setFlagsToSend.js';
import { loadTemplatePos } from '../utils/loadTemplatePos.js';
import { findElement } from '../utils/managmentDOM/controlElement.js';
import { regFishLogic } from '../utils/registrationFish.js';
import { sendToServer } from '../utils/sendToServer.js';

const listItem = (data) =>
    `
        <button class="cox-${data.id} list-group-item" id="${data.id}">
            ${data.title}
        </button>
    `;

const templateCancelModal = (data) =>
    `
        <div class="modal-cox-cancel">
            <button type="button" class="btn btn-primary modal-window modal-window-cox-cancel" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropCoxCancel"></button>
            
            <div class="modal fade" id="staticBackdropCoxCancel" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPorCancel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelCoxCancel">Bekreft</h5>
                            <button type="button" class="cox-btn-close" hidden data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere COX melding?</div>
                        
                        <div class="card-body-id-${data.id} mx-3 d-flex justify-content-center">
                        <table class="table-cox-cancel-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                        </div>
                        
                        <div class="modal-footer">
                            <a type="button" class="btn-modal-cox-cancel-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a type="button" class="btn-modal-cox-cancel-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Bekreft</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

let coxData;
let obList = [];
let kgList = [];
let obData;
let isSendMsg;

const cox = () => {
    let dc = document.querySelector('.dynamic-content');
    let logicCox;

    const isSend = isSendMsg.send | false;

    if (isSend === false || isSend === 0) {
        logicCox = () => {
            const tempcox = [];
            coxData.msg.forEach(cox => {
                if (cox && cox.RET) {
                    const lastcox = cox.RET[cox.RET.length - 1];
                    if (lastcox.RS === 'ACK' && lastcox.RE !== '522') {
                        tempcox.push(cox);
                    }
                }
            });

            const modalWindow = findElement('.modal-window-cox');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';

            tempcox.reverse();

            tempcox.forEach(cox => {
                const insert = findElement('.insert-cox-list');
                insert.innerHTML += listItem({
                    id: cox._id,
                    title: `${cox.stm32.TM}${cox._id} ${toDate(cox.stm32.DATI)}`
                });
            });

            const receive = findElement('.btn-modal-receive');
            const cancel = findElement('.btn-modal-cancel');
            const delivery = findElement('.btn-modal-delivery');
            const mainpos = findElement('.main-pos').innerHTML;
            console.log('mainpos', mainpos)


            let mode = '';

            window.onclick = (e) => {
                const elem = e ? e.target : window.event.srcElement;

                if (e.target.classList[0] === `cox-${elem.id}`) {
                    findElement('.btn-close')
                        .click();

                    dc.innerHTML += templateCancelModal({ id: elem.id });

                    const modalWindow = findElement('.modal-window');
                    modalWindow.click();
                    modalWindow.style.visibility = 'hidden';

                    coxData.msg.forEach(d => {
                        if (+d._id === +elem.id) {
                            displayAckMsg(elem.id, d.type, d.originalMsg);
                        }
                    });

                    const confirm = findElement('.btn-modal-cox-cancel-confirm');

                    confirm.onclick = () => {
                        const finalMsg = {
                            'req': { 'req': `DATIPOS COXCANCEL ${elem.id}` },
                            'data': {
                                'TM': 'COX',
                                'RN': elem.id,
                            }
                        };
                        
                        const updateFlags = {
                            'RN': elem.id,
                            'flags': setFlagsToSend(true),
                        };
                        console.log('finalMsg', finalMsg)
                        useHttp(`${state.url}/api/cox/`, 'PUT', updateFlags)
                            .then(d => console.log(d));
                        console.log(finalMsg)
                        useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                            .then(d => console.log(d));

                        dc.removeChild(findElement('.modal-cox-cancel'));
                        findElement('.btn-modal-cancel')
                            .click();
                        dc.removeChild(findElement('.cox-modal'));
                    };
                }
            };

            let appendLogic;

            appendLogic = async (names, codes) => {
                
                uCreateNewBlock(dc, 'cox', names, codes);
                //loadTemplatePos({ id: 0, title: 'cox', fav: coxData.fav });
                console.log('coxData.fav', coxData.fav)
                // printDataTemp('cox-1', coxData.fav);
                printData('cox-0', coxData.fish);
                
               // printData('cox-3', coxData.activity);

                window.onclick = (e) => {
                    const event = e ? e.target : window.event;
                    const id = Number(event.id.match(/\d+/g));

                    displaySelection(id, 'cox', obList, kgList);

                    if (event.classList[0] === `btn-cancel-cox-${id}`) {
                        closerAccordion(`collapsecox${id}`, `collapsecox${id - 1}`);
                    }

                    if (event.classList[0] === `btn-send-cox-${id}`) {
                        sendToServer({ id, last: 0 }, 'cox', { ob: obList, kg: kgList }, coxData);
                        console.log('coxData', coxData)

                    }

                    if (event.classList[0] === 'reg-cox-0') {
                        regFishLogic(0, 'cox', coxData, obData, obList);
                    }

                    // if (event.classList[0] === 'reg-cox-1') {
                    //     regFishLogic(1, 'cox', coxData, obData, obList, kgList);
                    // }
                };
            };

            delivery.onclick = async () => {
                mode = 'delivery';

                const names = [
                    //{ type: 'tposDep', value: 'Utgang fra sonen - Posisjon' },
                    { type: 'register', value: 'Kvantum ombord' },
                    //{ type: 'date', value: 'Avgi fangst - Dato og Tid' },
                ];

                const codes = ['ob', 'pdt'];

                await appendLogic(names, codes, mode);
            };
            cancel.onclick = () => cancel.click();

        };
    } else {
        logicCox = () => {
            dc.innerHTML = templateSystemBusyModal();
            const modalWindow = findElement('.modal-window');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';
        };
    }



    observer(dc, logicCox);
    return '';
};

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle('COX');
    }

    getData = async (callback) => {
        const result = {
            fish: await useHttp(`${state.url}/api/dep/fish`),
            msg: await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'COX' }),
            fav: await useHttp(`${state.url}/api/fav/`)
        }
        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);

        return callback(result);
    }

    templateModal = () =>
    `

    <div class="cox-modal">
    <button type="button" class="btn btn-primary modal-window-cox" 
        data-bs-toggle="modal" data-bs-target="#staticBackdropcox"></button>
    <div class="modal fade" id="staticBackdropcox" data-bs-backdrop="static" 
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelcox" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabelcox">cox - utgang fra sonen</h5>
                    <button style="visibility: hidden" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">NY cox</div>
                <div class="insert-cox-list d-flex flex-column"></div>
                <div class="modal-footer">
                    <a href="/" type="button" class="btn-modal-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                    <button type="button" class="btn-modal-delivery btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Neste</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;

    cox = async (data) => {
        coxData = data;
        const result = [];

        result.push(this.templateModal());

        return result.map(e => e).join('');
    }

    getHtml = async () =>
        `
        ${await this.getData(this.cox)}
        ${cox()}
 
    `;
}