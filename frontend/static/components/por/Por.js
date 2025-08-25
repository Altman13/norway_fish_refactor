import { displayAckMsg } from "../../utils/displayAckMsg.js";
import { observer } from "../../utils/observer/observer.js";
import { printData } from "../../utils/printData.js";
import { state } from "../../utils/state/state.js";
import { useHttp } from "../../utils/useHttp.js";
import AbstractView from "../../views/AbstractView.js";
import { templateSystemBusyModal } from "../dep/Dep.js";
import { closerAccordion } from "../fis/utils/accordionManager/closerAccordion.js";
import { uCreateNewBlock } from "../fis/utils/builder/loopBuilder.js";
import { toDate } from "../submenu/utils/toDate.js";
import { displaySelection } from "../utils/displaySelection.js";
import { setFlagsToSend } from "../utils/flags/setFlagsToSend.js";
import { findElement } from "../utils/managmentDOM/controlElement.js";
import { regFishLogic, updaterWeightFish } from "../utils/registrationFish.js";
import { sendToServer } from "../utils/sendToServer.js";

let porFiles;
let porDataTemp;
let obList = [];
let kgList = [];
let obData;
let isSendMsg;

const listItem = (data) =>
    `
        <button class="por-${data.id} list-group-item" id="${data.id}">
            ${data.title}
        </button>
    `

const templateModal = () =>
    `
        <div class="modal-por">
            <button type="button" class="btn btn-primary modal-window modal-window-por" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropPor"></button>
            
            <div class="modal fade" id="staticBackdropPor" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPor" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelPor">Kansellering!</h5>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere POR melding?</div>
                        
                        <div class="insert-por-list d-flex flex-column"></div>
                        
                        <div class="modal-footer">
                            <a href="/" type="button" class="btn-modal-por-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a type="button" class="btn-modal-por-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal" >New POR</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

const templateCancelModal = (data) =>
    `
        <div class="modal-por-cancel">
            <button type="button" class="btn btn-primary modal-window modal-window-por-cancel" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropPorCancel"></button>
            
            <div class="modal fade" id="staticBackdropPorCancel" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPorCancel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelPorCancel">Bekreft</h5>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere POR melding?</div>
                        
                        <div class="card-body-id-${data.id} mx-3 d-flex justify-content-center">
                        <table class="table-por-cancel-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                        </div>
                        
                        <div class="modal-footer">
                            <a href="/" type="button" class="btn-modal-por-cancel-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <button type="button" class="btn-modal-por-cancel-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Bekreft</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

const por = () => {
    const dc = document.querySelector('.dynamic-content');
    let logicPor;

    const isSend = isSendMsg.send | false;

    if (isSend === false || isSend === 0) {
        logicPor = () => {
            const temp = [];
            obList = [];
            kgList = [];
            porFiles.forEach(por => {
                if (por && por.RET) {
                    const lastPor = por.RET[por.RET.length - 1];
                    if (lastPor.RS === 'ACK' && lastPor.RE !== '522') {
                        temp.push(por);
                    }
                }
            });

            if (temp.length) {
                dc.innerHTML += templateModal();
                const modalWindow = findElement('.modal-window-por');
                modalWindow.click();
                modalWindow.style.visibility = 'hidden';

                temp.reverse();

                temp.forEach(por => {
                    const insert = findElement('.insert-por-list');
                    insert.innerHTML += listItem({
                        id: por._id,
                        title: `${por.stm32.TM}${por._id} ${toDate(por.stm32.DATI)}`
                    });
                });
            }

            const names = [
                { type: 'select', value: 'Anlop - Havn' },
                { type: 'input', value: 'Landingsanlegg' },
                { type: 'date', value: 'Havneanlop - Dato og Tid' },
                { type: 'date', value: 'Landing - Dato og Tid' },
                { type: 'register', value: 'Kvantum ombord' },
                { type: 'register', value: 'Kvantum til levering' }
            ];

            const codes = ['po', 'ls', 'dhl', 'pdt', 'ob', 'kg'];

            uCreateNewBlock(dc, 'por', names, codes);

            printData(`por-0`, porDataTemp.ports);
            printData(`por-4`, porDataTemp.fish);
            printData(`por-5`, porDataTemp.fish);

            window.onclick = (e) => {
                const event = e ? e.target : window.event;
                const id = Number(event.id.match(/\d+/g));

                //displaySelection(id, 'por', obList, kgList);

                if (e.target.classList[0] === `por-${event.id}`) {
                    findElement('.btn-modal-por-confirm')
                        .click();

                    dc.innerHTML += templateCancelModal({ id: event.id });
                    const modalWindow = findElement('.modal-window-por-cancel');
                    modalWindow.click();
                    modalWindow.style.visibility = 'hidden';

                    porFiles.forEach(d => {
                        if (+d._id === +event.id) {
                            displayAckMsg(event.id, d.type, d.originalMsg);
                        }
                    });

                    const confirm = findElement('.btn-modal-por-cancel-confirm');

                    confirm.onclick = () => {
                        const finalMsg = {
                            'req': { 'req': `DATIPOS PORCANCEL ${event.id}` },
                            'data': {
                                'TM': 'POR',
                                'RN': event.id,
                            }
                        };

                        const updateFlags = {
                            'RN': event.id,
                            'flags': setFlagsToSend(true),
                        }

                        useHttp(`${state.url}/api/por/`, 'PUT', updateFlags)
                            .then(d => console.log(d));

                        useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                            .then(d => console.log(d));

                        findElement('.global-cancel-btn').click();
                    }
                }

                else if (event.classList[0] === `btn-cancel-por-${id}`) {
                    closerAccordion(`collapsepor${id}`, `collapsepor${id - 1}`)
                }

                else if (event.classList[0] === `reg-por-4`) {
                    regFishLogic(4, 'por', porDataTemp, obData, obList);
                    if (event.classList[0].match('por-weight')) {
                        updaterWeightFish(id, 'por', obList, event);
                    }
                }

                else if (event.classList[0] === `reg-por-5`) {
                    console.log(porDataTemp)
                    //displaySelection(id, 'por', obList, kgList);
                    regFishLogic(5, 'por', porDataTemp, obData, obList, kgList);
                    regFishLogic(2, 'tra', traData, obData, obList, kgList);
                    if (event.classList[0].match('por-weight')) {
                        updaterWeightFish(id, 'por', kgList, event);
                    }
                }

                else if (event.classList[0] === `btn-send-por-${id}`) {
                    sendToServer({ id, last: 5 }, 'por', { ob: obList, kg: kgList }, porDataTemp);
                
                }
            }
        }
    } else {
        logicPor = () => {
            dc.innerHTML = templateSystemBusyModal();
            const modalWindow = findElement('.modal-window');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';
        };
    }

    observer(dc, logicPor);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('POR');
    }

    getData = async () => {
        porDataTemp = await useHttp(`${state.url}/api/dep/`);
        porFiles = await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'POR' });
        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);
        return '';
    }

    getHtml = async () =>
        `
        ${await this.getData()}    
        ${por()}  
    `
}