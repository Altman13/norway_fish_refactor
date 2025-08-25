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
        <button class="coe-${data.id} list-group-item" id="${data.id}">
            ${data.title}
        </button>
    `;

const templateCancelModal = (data) =>
    `
        <div class="modal-coe-cancel">
            <button type="button" class="btn btn-primary modal-window modal-window-coe-cancel" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropCoeCancel"></button>
            
            <div class="modal fade" id="staticBackdropCoeCancel" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPorCancel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelCoeCancel">Bekreft</h5>
                            <button type="button" class="coe-btn-close" hidden data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere COE melding?</div>
                        
                        <div class="card-body-id-${data.id} mx-3 d-flex justify-content-center">
                        <table class="table-coe-cancel-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                        </div>
                        
                        <div class="modal-footer">
                            <a type="button" class="btn-modal-coe-cancel-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a type="button" class="btn-modal-coe-cancel-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Bekreft</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

let coeData;
let obList = [];
let kgList = [];
let obData;
let isSendMsg;

const coe = () => {
    let dc = document.querySelector('.dynamic-content');
    let logicCoe;

    const isSend = isSendMsg.send | false;

    if (isSend === false || isSend === 0) {
        logicCoe = () => {
            const tempCoe = [];
            coeData.msg.forEach(coe => {
                if (coe && coe.RET) {
                    const lastCoe = coe.RET[coe.RET.length - 1];
                    if (lastCoe.RS === 'ACK' && lastCoe.RE !== '522') {
                        tempCoe.push(coe);
                    }
                }
            });

            const modalWindow = findElement('.modal-window-coe');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';

            tempCoe.reverse();

            tempCoe.forEach(coe => {
                const insert = findElement('.insert-coe-list');
                insert.innerHTML += listItem({
                    id: coe._id,
                    title: `${coe.stm32.TM}${coe._id} ${toDate(coe.stm32.DATI)}`
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

                if (e.target.classList[0] === `coe-${elem.id}`) {
                    findElement('.btn-close')
                        .click();

                    dc.innerHTML += templateCancelModal({ id: elem.id });

                    const modalWindow = findElement('.modal-window');
                    modalWindow.click();
                    modalWindow.style.visibility = 'hidden';

                    coeData.msg.forEach(d => {
                        if (+d._id === +elem.id) {
                            displayAckMsg(elem.id, d.type, d.originalMsg);
                        }
                    });

                    const confirm = findElement('.btn-modal-coe-cancel-confirm');

                    confirm.onclick = () => {
                        const finalMsg = {
                            'req': { 'req': `DATIPOS COECANCEL ${elem.id}` },
                            'data': {
                                'TM': 'COE',
                                'RN': elem.id,
                            }
                        };
                        
                        const updateFlags = {
                            'RN': elem.id,
                            'flags': setFlagsToSend(true),
                        };
                        console.log('finalMsg', finalMsg)
                        useHttp(`${state.url}/api/coe/`, 'PUT', updateFlags)
                            .then(d => console.log(d));
                        console.log(finalMsg)
                        useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                            .then(d => console.log(d));

                        dc.removeChild(findElement('.modal-coe-cancel'));
                        findElement('.btn-modal-cancel')
                            .click();
                        dc.removeChild(findElement('.coe-modal'));
                    };
                }
            };

            let appendLogic;

            appendLogic = async (names, codes) => {
                
                uCreateNewBlock(dc, 'coe', names, codes);
                //loadTemplatePos({ id: 0, title: 'coe', fav: coeData.fav });
                console.log('coeData.fav', coeData.fav)
                printDataTemp('coe-0', coeData.fav);
                printDataTemp('coe-1', coeData.fav);
                // printDataTemp('coe-1', coeData.fav);
                printData('coe-2', coeData.fish);
                printData('coe-3', coeData.fish);
                
               // printData('coe-3', coeData.activity);

                window.onclick = (e) => {
                    const event = e ? e.target : window.event;
                    const id = Number(event.id.match(/\d+/g));

                    displaySelection(id, 'coe', obList, kgList);

                    if (event.classList[0] === `btn-cancel-coe-${id}`) {
                        closerAccordion(`collapsecoe${id}`, `collapsecoe${id - 1}`);
                    }

                    if (event.classList[0] === `btn-send-coe-${id}`) {
                        sendToServer({ id, last: 4 }, 'coe', { ob: obList, kg: kgList }, coeData);
                    }

                    if (event.classList[0] === 'reg-coe-3') {
                        regFishLogic(3, 'coe', coeData, obData, obList);
                    }

                    if (event.classList[0] === 'reg-coe-3') {
                        regFishLogic(3, 'coe', coeData, obData, obList, kgList);
                    }
                };
            };

            delivery.onclick = async () => {
                mode = 'delivery';

                const names = [
                    { type: 'tposDep', value: 'Avgangsposisjon - Posisjon' },
                    { type: 'tposDep', value: 'Inngang til sonen - Posisjon' },
                    { type: 'select', value: 'Malart' },
                    { type: 'register', value: 'Kvantum ombord' },
                    { type: 'date', value: 'Avgi fangst - Dato og Tid' },
                ];

                const codes = ['xtg', 'lao', 'ds', 'ob', 'pdt'];

                await appendLogic(names, codes, mode);
            };
            cancel.onclick = () => cancel.click();

        };
    } else {
        logicCoe = () => {
            dc.innerHTML = templateSystemBusyModal();
            const modalWindow = findElement('.modal-window');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';
        };
    }



    observer(dc, logicCoe);
    return '';
};

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle('COE');
    }

    getData = async (callback) => {
        const result = {
            fish: await useHttp(`${state.url}/api/dep/fish`),
            msg: await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'COE' }),
            fav: await useHttp(`${state.url}/api/fav/`)
        }
        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);

        return callback(result);
    }

    templateModal = () =>
    `

    <div class="coe-modal">
    <button type="button" class="btn btn-primary modal-window-coe" 
        data-bs-toggle="modal" data-bs-target="#staticBackdropcoe"></button>
    <div class="modal fade" id="staticBackdropcoe" data-bs-backdrop="static" 
        data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelcoe" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabelcoe">coe - inngang til sonen</h5>
                    <button style="visibility: hidden" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">NY coe</div>
                <div class="insert-coe-list d-flex flex-column"></div>
                <div class="modal-footer">
                    <a href="/" type="button" class="btn-modal-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                    <button type="button" class="btn-modal-delivery btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Neste</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;

    coe = async (data) => {
        coeData = data;
        const result = [];

        result.push(this.templateModal());

        return result.map(e => e).join('');
    }

    getHtml = async () =>
        `
        ${await this.getData(this.coe)}      
        ${coe()}
 
    `;
}