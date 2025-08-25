import AbstractView from "../../views/AbstractView.js";
import {observer} from "../../utils/observer/observer.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";
import {findElement} from "../utils/managmentDOM/controlElement.js";
import {createFisPage} from "../../utils/rebuild/createFisPage.js";
import {clearLoops} from "./utils/clearLoops.js";

let fisHal = [];

const fis = () => {
    const dc = document.querySelector('.dynamic-content');
    clearLoops();
    
    const logicFis = () => {
        createFisPage(dc, fisHal, 'beforeend');
        window.onclick = (e) => {
            const elem = e ? e.target : window.event.srcElement;
            const cancel = findElement(`.btn-cancel-FIS-${elem.id}`);

            if (cancel && elem.id && `btn-cancel-FIS-${elem.id}` === cancel.classList[0]) {
                const msg = {
                    'req': {'req': 'DATIPOS FIS'},
                    'data': {'TM': 'FIS', 'STATUS': 'INACTIVE', 'id': elem.id}
                };

                useHttp(`${state.url}/api/stm32/send`, 'POST', msg)
                    .then(d => console.log(d));
                    window.location.reload
                }

        }

        const createFisOperatetion = findElement('.btn-send-out-fis');
        createFisOperatetion.onclick = () => {
            const msg = {'req': {'req': 'DATIPOS FIS'}, 'data': {'TM': 'FIS', 'STATUS': 'ACTIVE'}};
            useHttp(`${state.url}/api/stm32/send`, 'POST', msg)
                .then(data => {
                    console.log(data)
                });
                window.location.reload
        }

    }

    observer(dc, logicFis);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Fiske');
    }

    getData = async (callback) => {
        const names = await useHttp(`${state.url}/api/main/get-files`, 'POST', {type: 'FIS'});
        return callback(names);
    }

    fis = async (data) => {
        fisHal = data;
        return '';
    };

    getHtml = async () =>
        `
        ${await this.getData(this.fis)}
        ${fis()}
    `;
}