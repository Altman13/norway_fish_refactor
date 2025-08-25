import { observer } from "../../../utils/observer/observer.js";
import { state } from "../../../utils/state/state.js";
import { useHttp } from "../../../utils/useHttp.js";
import AbstractView from "../../../views/AbstractView.js";
import { findElement } from "../../utils/managmentDOM/controlElement.js";
import { template } from "../../utils/templates/templateAccordion.js";
import { temp } from "../../utils/templates/templateData.js";

export const templateTable = async (data) =>
    `   
    <tr class="tr-id-${data.id}">
        <th scope="row">
            <img src="/static/icons/${data.svgStatus}.svg" height="20" width="20" id="${data.id}" class="svg-id-${data.id}" alt="">
        </th>
        <td class="${data.code} td-name-id-${data.id}">${data.name}</td>
        <td class="td-weight-id-${data.id}">${data.date}</td>
    </tr>                         
`
const loop6 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop6 = async () => {
        const table = findElement('.tableHere');
        const sendProcces3 = findElement('.btn-send-id-0');
        const sendProcces1 = findElement('.btn-send-id-1');

        findElement('.btn-cancel-id-0')
            .remove();
        findElement('.btn-cancel-id-1')
            .remove();

        table.innerHTML = await templateTable({
            id: 0,
            name: 'PS',
            date: '2020.02.16 - 11.15 UTC',
            svgStatus: 'Warning',
        });

        sendProcces3.onclick = () => {
            process3();
        }
        sendProcces1.onclick = () => {
            process1();
        }
    }

    const process1 = () => {
        const data = JSON.parse(localStorage.unionData);

        if (data) {
            const finalMsg = {
                'req': {'req': 'DATIPOS DCA'},
                'data': {
                    'TM': 'DCA',
                    'RC': 'RCSIG27',
                    'data': data
                }
            };

            useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                .then(data => console.log(data));

            localStorage.sendFlag = true;
            localStorage[finalMsg.data.TM] = JSON.stringify({
                TM: finalMsg.data.TM,
                SEND: true,
                SYNC_ANSWER: false
            });
        }
    }

    const process3 = () => {
        const msg = {'req': {'req': 'DATIPOS DCA'}, 'data': {'TM': 'DCA'}};
        useHttp(`${state.url}/api/stm32/send`, 'POST', msg)
            .then(d => console.log(d));
    }

    observer(dc, logicLoop6);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop6');
    }

    loop6 = async () => {
        let result = [];
        const names = ['SEND DCA - FANGSTMELDING', 'SEND DCA - FANGSTMELDING'];

        for (let i = 0; i < names.length; ++i) {
            if (i === 0) result.push(await template(temp(i, names), this.templatePage1({id: i})));
            else if (i === 1) result.push(await template(temp(i, names), this.templateTable({
                id: i,
                sendName: 'Send',
                cancelName: 'Tilbake'
            })));
        }

        return result.map(e => e).join('');
    }

    templatePage1 = async (data) =>
        `
        <ul class="list-group mt-3 mb-3">
            <li class="list-item-id-${data.id} list-group-item">
                <img src="/static/icons/OK.svg" height="30" width="30" class="me-3" alt="">
                STIMER - Ingen Fanstoperasjon
            </li>
        </ul>
        
        <div class="input-group mb-3">
            <span class="input-group-text">Havn</span>
            <input type="text" aria-label="First name" class="input-text-${data.id} form-control">
        </div>
    `;

    templateTable = async (data) =>
        `       
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                </tr>
            </thead>
            <tbody class="tableHere"></tbody>
        </table>
        <div class="input-group mb-3">
            <span class="input-group-text">Havn</span>
            <input type="text" aria-label="First name" class="input-text-${data.id} form-control">
        </div>
    `;

    getHtml = async () =>
        `
        ${await this.loop6()}
        ${loop6()}
        <div class="btn-group btn-group-lg d-flex justify-content-center mt-3" role="group"
                aria-label="Basic example">
            <a href="${localStorage.backpage}" type="button" class="btn-cancel-out btn btn-danger" data-link>Cancel</a>
        </div>  
    `
}