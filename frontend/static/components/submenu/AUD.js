import AbstractView from "../../views/AbstractView.js";
import {observer} from "../../utils/observer/observer.js";
import {temp} from "../utils/templates/templateData.js";
import {findElement} from "../utils/managmentDOM/controlElement.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";
import {setFlagsToSend} from "../utils/flags/setFlagsToSend.js";
import {buildFinalMsg} from "../fis/utils/buildFinalMsg.js";

const aud = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicAud = () => {
        const input = findElement('.input-text-0');

        findElement('.btn-send-out')
            .onclick = () => {
            let data = {
                TM: 'AUD',
                'AD': 'NOR',
                'RC': '',
                'MA': state.LOGIN.toUpperCase(),
            }

            if (input.value.length) {
                data.MS = input.value;
            }

            const finalMsg = {
                'req': {'req': 'DATIPOS AUD'},
                data,
                flags: setFlagsToSend(true),
            };

            useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                .then(d => console.log(d));

            findElement('.global-cancel-btn').click();
        }
    }

    observer(dc, logicAud);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Aud');
    }

    aud = async () => {
        let result = [];

        result.push(await this.templateAud(temp(0, 'AUD - SEND TESTMELDING')));

        return result.map(e => e).join('');
    }

    templateAud = async (data) =>
    `
        <div class="card">
            <h5 class="card-header text-center text-uppercase">Aud - send testmelding</h5>
            <div class="card-body">
                <div class="accordion-body">
                    <div class="input-group mb-3">           
                        <input type="text" class="input-text-${data.id} form-control" placeholder="Free text" aria-label="FreeText">                                        
                    </div>
                    <div class="btn-group btn-group-lg d-flex justify-content-center" role="group"
                        aria-label="Basic example">
                        <button type="button" class="btn-cancel-out btn btn-outline-danger">Tilbake</button>
                        <button type="button" class="btn-send-out btn btn-outline-success">Neste</button>
                    </div>
                </div>    
            </div>
        </div>
    `

    getHtml = async () =>
    `
        ${await this.aud()}
        ${aud()}
    `
}