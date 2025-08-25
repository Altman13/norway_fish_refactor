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
        <button class="tra-${data.id} list-group-item" id="${data.id}">
            ${data.title}
        </button>
    `;

const templateCancelModal = (data) =>
    `
        <div class="modal-tra-cancel">
            <button type="button" class="btn btn-primary modal-window modal-window-tra-cancel" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropTraCancel"></button>
            
            <div class="modal fade" id="staticBackdropTraCancel" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPorCancel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelTraCancel">Bekreft</h5>
                            <button type="button" class="tra-btn-close" hidden data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere TRA melding?</div>
                        
                        <div class="card-body-id-${data.id} mx-3 d-flex justify-content-center">
                        <table class="table-tra-cancel-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                        </div>
                        
                        <div class="modal-footer">
                            <a type="button" class="btn-modal-tra-cancel-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a type="button" class="btn-modal-tra-cancel-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Bekreft</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

let traData;
let obList = [];
let kgList = [];
let obData;
let isSendMsg;

const tra = () => {
    let dc = document.querySelector('.dynamic-content');
    let logicTra;

    const isSend = isSendMsg.send | false;

    if (isSend === false || isSend === 0) {
        logicTra = () => {
            const tempTra = [];
            traData.msg.forEach(tra => {
                if (tra && tra.RET) {
                    const lastTra = tra.RET[tra.RET.length - 1];
                    if (lastTra.RS === 'ACK' && lastTra.RE !== '522') {
                        tempTra.push(tra);
                    }
                }
            });

            const modalWindow = findElement('.modal-window-tra');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';

            tempTra.reverse();

            tempTra.forEach(tra => {
                const insert = findElement('.insert-tra-list');
                insert.innerHTML += listItem({
                    id: tra._id,
                    title: `${tra.stm32.TM}${tra._id} ${toDate(tra.stm32.DATI)}`
                });
            });

            const receive = findElement('.btn-modal-receive');
            const cancel = findElement('.btn-modal-cancel');
            const delivery = findElement('.btn-modal-delivery');

            let mode = '';

            window.onclick = (e) => {
                const elem = e ? e.target : window.event.srcElement;

                if (e.target.classList[0] === `tra-${elem.id}`) {
                    findElement('.btn-close')
                        .click();

                    dc.innerHTML += templateCancelModal({ id: elem.id });

                    const modalWindow = findElement('.modal-window');
                    modalWindow.click();
                    modalWindow.style.visibility = 'hidden';

                    traData.msg.forEach(d => {
                        if (+d._id === +elem.id) {
                            displayAckMsg(elem.id, d.type, d.originalMsg);
                        }
                    });

                    const confirm = findElement('.btn-modal-tra-cancel-confirm');

                    confirm.onclick = () => {
                        const finalMsg = {
                            'req': { 'req': `DATIPOS TRACANCEL ${elem.id}` },
                            'data': {
                                'TM': 'TRA',
                                'RN': elem.id,
                            }
                        };

                        const updateFlags = {
                            'RN': elem.id,
                            'flags': setFlagsToSend(true),
                        };

                        useHttp(`${state.url}/api/tra/`, 'PUT', updateFlags)
                            .then(d => console.log(d));

                        useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                            .then(d => console.log(d));

                        dc.removeChild(findElement('.modal-tra-cancel'));
                        findElement('.btn-modal-cancel')
                            .click();
                        dc.removeChild(findElement('.tra-modal'));
                    };
                }
            };

            let appendLogic;

            appendLogic = async (names, codes) => {
                uCreateNewBlock(dc, 'tra', names, codes);
                loadTemplatePos({ id: 0, title: 'tra', fav: traData.fav });
                printDataTemp('tra-0', traData.fav);
                printData('tra-1', traData.fish);
                printData('tra-2', traData.fish);

                window.onclick = (e) => {
                    const event = e ? e.target : window.event;
                    const id = Number(event.id.match(/\d+/g));

                   // displaySelection(id, 'tra', obList, kgList);

                    if (event.classList[0] === `btn-cancel-tra-${id}`) {
                        closerAccordion(`collapsetra${id}`, `collapsetra${id - 1}`);
                    }

                    if (event.classList[0] === `btn-send-tra-${id}`) {
                        sendToServer({ id, last: 4 }, 'tra', { ob: obList, kg: kgList }, traData);
                    }

                    if (event.classList[0] === 'reg-tra-1') {
                        regFishLogic(1, 'tra', traData, obData, obList);
                    }

                    if (event.classList[0] === 'reg-tra-2') {
                        //regFishLogic(2, 'tra', traData, obData, obList);
                        regFishLogic(2, 'tra', traData, obData, obList, kgList);
                    }
                };
            };

            delivery.onclick = async () => {
                mode = 'delivery';

                const names = [
                    { type: 'tposDep', value: 'Avgi fangst - Antatt posisjon' },
                    { type: 'register', value: 'Kvantum ombord' },
                    { type: 'register', value: 'Kvantum til overforing' },
                    { type: 'input', value: 'Overfort TIL' },
                    { type: 'date', value: 'Avgi fangst - Dato og Tid' }
                ];

                const codes = ['lao', 'ob', 'kg', 'tt', 'pdt'];

                await appendLogic(names, codes, mode);
            };

            receive.onclick = async () => {
                mode = 'receive';

                const names = [
                    { type: 'tposDep', value: 'Motta fangst - Antatt Posisjon' },
                    { type: 'register', value: 'Kvantum ombord' },
                    { type: 'register', value: 'Kvantum overfort' },
                    { type: 'input', value: 'Overfort FRA' },
                    { type: 'date', value: 'Avgi fangst - Dato og Tid' }
                ];

                const codes = ['lao', 'ob', 'kg', 'tf', 'pdt'];

                await appendLogic(names, codes, mode);
            };

            cancel.onclick = () => cancel.click();

        };
    } else {
        logicTra = () => {
            dc.innerHTML = templateSystemBusyModal();
            const modalWindow = findElement('.modal-window');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';
        };
    }



    observer(dc, logicTra);
    return '';
};

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle('TRA');
    }

    getData = async (callback) => {
        const result = {
            fish: await useHttp(`${state.url}/api/dep/fish`),
            msg: await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'TRA' }),
            fav: await useHttp(`${state.url}/api/fav/`)
        }
        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);

        return callback(result);
    }

    templateModal = () =>
        `
        <div class="tra-modal">
        <button type="button" class="btn btn-primary modal-window-tra" 
            data-bs-toggle="modal" data-bs-target="#staticBackdropTra"></button>
        
        <div class="modal fade" id="staticBackdropTra" data-bs-backdrop="static" 
            data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelTra" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabelTra">TRA - Omlasting / lassetting</h5>
                        <button style="visibility: hidden" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">NY TRA</div>
                    
                    <div class="insert-tra-list d-flex flex-column"></div>
                    
                    <div class="modal-footer">
                        <a href="/" type="button" class="btn-modal-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                        <button type="button" class="btn-modal-receive btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Motta neste</button>
                        <button type="button" class="btn-modal-delivery btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Avgi neste</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;

    tra = async (data) => {
        traData = data;
        const result = [];

        result.push(this.templateModal());

        return result.map(e => e).join('');
    }

    getHtml = async () =>
        `
        ${await this.getData(this.tra)}      
        ${tra()}
 
    `;
}