import { displayAckMsg } from '../../utils/displayAckMsg.js';
import { observer } from '../../utils/observer/observer.js';
import { state } from '../../utils/state/state.js';
import { useHttp } from '../../utils/useHttp.js';
import AbstractView from '../../views/AbstractView.js';
import { templateSystemBusyModal } from '../dep/Dep.js';
import { toDate } from '../submenu/utils/toDate.js';
import { setFlagsToSend } from '../utils/flags/setFlagsToSend.js';
import { findElement } from '../utils/managmentDOM/controlElement.js';

const listItem = (data) =>
    `
        <button class="sone-${data.id} list-group-item" type="${data.type}" id="${data.id}">
            ${data.title}
        </button>
    `;

const templateCancelModal = (data) =>
    `
        <div class="modal-sone-cancel">
            <button type="button" class="btn btn-primary modal-window modal-window-sone-cancel" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropSoneCancel"></button>
            
            <div class="modal fade" id="staticBackdropSoneCancel" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelPorCancel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelSoneCancel">Bekreft</h5>
                            <button type="button" class="sone-btn-close" hidden data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere SONE melding?</div>
                        
                        <div class="card-body-id-${data.id} mx-3 d-flex justify-content-center">
                        <table class="table-sone-cancel-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                        </div>
                        
                        <div class="modal-footer">
                            <a type="button" class="btn-modal-sone-cancel-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a type="button" class="btn-modal-sone-cancel-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal">Bekreft</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

let isSendMsg;
let coeCoxFiles = [];

const sone = () => {
    const dc = document.querySelector('.dynamic-content');

    const isSend = isSendMsg.send | false;

    let logicsone;

    if (isSend === false || isSend === 0) {
        logicsone = () => {
            const temp = [];
            coeCoxFiles.flat().forEach(sone => {
                if (sone && sone.RET) {
                    const lastSone = sone.RET[sone.RET.length - 1];
                    if (lastSone.RS === 'ACK' && lastSone.RE !== '522') {
                        temp.push(sone);
                    }
                }
            });

            if (temp.length) {
                const modalWindow = findElement('.modal-window-sone');
                modalWindow.click();
                modalWindow.style.visibility = 'hidden';

                temp.reverse().forEach(sone => {
                    const insert = findElement('.insert-sone-list');
                    insert.innerHTML += listItem({
                        id: sone._id,
                        title: `${sone.stm32.TM}${sone._id} ${toDate(sone.stm32.DATI)}`,
                        type: sone.stm32.TM
                    });
                });
            }

            window.onclick = (e) => {
                const event = e ? e.target : window.event;

                if (e.target.classList[0] === `sone-${event.id}`) {
                    findElement('.btn-close')
                        .click();

                    dc.innerHTML = templateCancelModal({ id: event.id });
                    const modalWindow = findElement('.modal-window');
                    modalWindow.click();
                    modalWindow.style.visibility = 'hidden';

                    coeCoxFiles.flat().forEach(d => {
                        if (+d._id === +event.id) {
                            displayAckMsg(event.id, 'sone', d.originalMsg);
                        }
                    });

                    const confirm = findElement('.btn-modal-sone-cancel-confirm');

                    confirm.onclick = () => {
                        const type = e.target.getAttribute('type');
                        const finalMsg = {
                            'req': { 'req': `DATIPOS ${type}CANCEL ${event.id}` },
                            'data': {
                                'TM': type,
                                'RN': event.id,
                            }
                        };

                        const updateFlags = {
                            'RN': event.id,
                            'flags': setFlagsToSend(true),
                        };

                        useHttp(`${state.url}/api/tra/`, 'PUT', updateFlags)
                            .then(d => console.log(d));

                        useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                            .then(d => console.log(d));

                        findElement('.global-cancel-btn').click();
                    };
                }
            };
        };
    } else {
        logicsone = () => {
            dc.innerHTML = templateSystemBusyModal();
            const modalWindow = findElement('.modal-window');
            modalWindow.click();
            modalWindow.style.visibility = 'hidden';
        };
    }

    observer(dc, logicsone);
    return '';
};

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('SONE');
    }

    templateModal() {
        return `
        <div class="modal-sone">
            <button type="button" class="btn btn-primary modal-window modal-window-sone" 
                data-bs-toggle="modal" data-bs-target="#staticBackdropSone"></button>
            
            <div class="modal fade" id="staticBackdropSone" data-bs-backdrop="static" 
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabelSone" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-uppercase" id="staticBackdropLabelSone">Kansellering!</h5>
                            <button style="visibility: hidden" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">Vil du kansellere SONE melding?</div>
                        
                        <div class="insert-sone-list d-flex flex-column"></div>
                        
                        <div class="modal-footer">
                            <a href="/" type="button" class="btn-modal-sone-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                            <a href="/coe" type="button" class="btn-modal-coe btn btn-outline-success text-uppercase" data-bs-dismiss="modal" data-link>COE</a>
                            <a href="/cox" type="button" class="btn-modal-cox btn btn-outline-success text-uppercase" data-bs-dismiss="modal" data-link>COX</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    async getData() {
        const result = [];
        coeCoxFiles = [];

        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);
        coeCoxFiles.push(await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'COE' }));
        coeCoxFiles.push(await useHttp(`${state.url}/api/main/get-files`, 'POST', { type: 'COX' }));

        result.push(this.templateModal());

        return result.map(e => e).join('');
    }

    async getHtml() {
        return `
            ${await this.getData()}
            ${sone()}
        `;
    }
}