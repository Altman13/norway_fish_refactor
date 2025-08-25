import {observer} from "../../../utils/observer/observer.js";
import AbstractView from "../../../views/AbstractView.js";
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {createBlockA, createBlockB, createRecordDca} from "./dcaBuilder.js";
import {useHttp} from "../../../utils/useHttp.js";
import {state} from "../../../utils/state/state.js";
import {templateContainerAccordion} from "../../fis/utils/accordionManager/createAccordion.js";
import {templateButton, templateSendButton} from "../../fis/utils/components/components.js";
import {closerAccordion} from "../../fis/utils/accordionManager/closerAccordion.js";
import {regFishLogic, updaterWeightFish} from "../../utils/registrationFish.js";
import {calculateDU} from "../../utils/managmentTime/calculateDU.js";
import {buildFinalMsg} from "../../fis/utils/buildFinalMsg.js";
import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";
import {displaySelection} from "../../utils/displaySelection.js";

const templateBr = () =>
    `
        <div class="d-flex justify-content-center align-items-center mb-3" 
            style="
            border-radius: 7px;
            font-size: 20px; 
            background-color: #0a53be;
            color: white;
            "
        >
            <span class="">Block B</span>
        </div>
    `

let dcaDataTemp;
let obData;
const obList = {};

const getCode = (list, type, name) => {
    const elem = list.find(get => get.type === type.toLowerCase());
    return elem.data.find(get => get.name === name);
};

let RN;

const dcaEdit = () => {
    const dc = document.querySelector('.dynamic-content');

    const updateTitle = (id, list) => {
        const content = findElement(`.content-dca-${id}`);
        const caBlock = findElement(`.datalist-dca-${id}`)?.getAttribute('code');
        if (content && caBlock === 'CA') {
            content.textContent = '';
            list.forEach(el => {
                content.textContent += `${el.name} ${el.weight} `;
            });
        }
    }

    const logicDcaEdit = () => {
        const dcaInsert = findElement('.dca-operation');
        let id = 0;
        setTimeout(() => {
            if (localStorage.dca) {
                const temp = JSON.parse(localStorage.dca);
                const removeKeys = ['TM', 'AD', 'MA', 'RN', 'RC', 'DATI'];
                const dca = temp.stm32_edit ? temp.stm32_edit : temp.stm32;
                if (dca.QI) {
                    dca.QI = String(dca.QI);
                }
                delete dca.RE;
                RN = dca.RN;

                let indexBlockB = 0;

                delete dca.id;

                for (const key in dca) {
                    if (removeKeys.indexOf(key) < 0) {
                        if (typeof dca[key] === 'object') {
                            dcaInsert.insertAdjacentHTML('beforeend', templateBr());
                            for (const val in dca[key]) {
                                const keyB = val;
                                const valB = dca[key][val];
                                createBlockB(++id, dcaDataTemp, keyB, valB, indexBlockB, obList);
                            }
                        } else {
                            createBlockA(++id, dcaDataTemp, key, dca[key]);
                        }
                    }
                }
            }
            dcaInsert.insertAdjacentHTML('beforeend', templateSendButton({id: 888, title: 'dca'}));

        }, 100);
    }

    window.onclick = (e) => {
        const event = e ? e.target : window.event;
        const id = Number(event.id.match(/\d+/g));
        const findBlock = findElement(`.datalist-dca-${id}`)?.getAttribute('block');

        displaySelection(id, 'dca', obList);

        if (event.classList[0] === `btn-cancel-dca-${id}`) {
            closerAccordion(`collapsedca${id}`, `collapsedca${id - 1}`)
        }

        if (event.classList[0] === `btn-send-dca-${id}`) {
            closerAccordion(`collapsedca${id}`, null, `collapsedca${id + 1}`);
            updateTitle(id, obList[findBlock])
        }

        if (event.classList[0]?.match('reg-dca')) {
            const fish = dcaDataTemp.find(get => get.type === 'fish');
            regFishLogic(id, 'dca', fish.data, obData, obList[findBlock]);
            updateTitle(id, obList[findBlock]);
        }

        if (event.classList[0].match('dca-weight')) {
            const eId = event.classList[0].match(/\d/)[0]
            const findBlock = findElement(`.datalist-dca-${eId}`).getAttribute('block');
            updaterWeightFish(id, 'dca', obList[findBlock], event);
            updateTitle(eId, obList[findBlock]);
        }

        if (event.classList[0] === 'btn-send-dca-888') {
            const getData = document.querySelectorAll('.dca-exit');
            let obj = {};
            obj.blockA = {};
            obj.originalMsg = {};
            let bredde;
            let lendge;

            getData.forEach(rec => {
                const checkBlockB = rec.getAttribute('block');
                const code = rec.getAttribute('code');
                const keys = ['GE', 'GP', 'GS', 'SE', 'SS', 'ZO'];

                if (checkBlockB) {
                    if (obj[checkBlockB]) {
                        if (keys.find(key => key === code)) {
                            obj[checkBlockB][code] = getCode(dcaDataTemp, code, String(rec.value))?.code;
                        } else {
                            if (code === 'CA') {
                                obj[checkBlockB][code] = obList[checkBlockB];
                            } else if (code === 'BDT') {
                                obj[checkBlockB]['BDT'] = rec.value ? rec.value : rec.getAttribute('value');
                            } else if (code.match('LTG')) {
                                if (rec.classList[0].match('input-bredde-dca')) {
                                    bredde = rec.value;
                                }
                                if (rec.classList[0].match('input-lendge-dca')) {
                                    lendge = rec.value;
                                }
                                obj[checkBlockB]['LTG'] = `${bredde} ${lendge}`;
                            } else if (code.match('XTG')) {
                                if (rec.classList[0].match('input-bredde-dca')) {
                                    bredde = rec.value;
                                }
                                if (rec.classList[0].match('input-lendge-dca')) {
                                    lendge = rec.value;
                                }
                                obj[checkBlockB]['XTG'] = `${bredde} ${lendge}`;
                            } else {
                                obj[checkBlockB][code] = rec.value;
                            }
                        }
                    } else {
                        obj[checkBlockB] = {}
                        if (keys.find(key => key === code)) {
                            obj[checkBlockB][code] = getCode(dcaDataTemp, code, rec.value).code;
                        } else {
                            obj[checkBlockB][code] = rec.value;
                        }
                    }
                } else {
                    if (code !== 'CA') {
                        obj.blockA.TM = 'DCA';
                        obj.blockA.AD = 'NOR';
                        obj.blockA.RN = RN;
                        obj.blockA.RE = '511';
                        obj.blockA.MA = state.LOGIN.toUpperCase();
                        obj.blockA.DATI = '';
                        obj.blockA[code] = getCode(dcaDataTemp, code, rec.value).code;
                    }
                }
            });
            const res = {};

            for (const key in obj) {
                if (key === 'blockA') {
                    for (const k in obj[key]) {
                        res[k] = obj[key][k];
                    }
                }
                if (key.match('blockB')) {
                    for (const k in obj[key]) {
                        if (res[key]) {
                            if (k === 'GP' || k === 'GS') {
                                res[key][k] = String(obj[key][k]);
                            } else {
                                res[key][k] = obj[key][k];
                            }
                        } else {
                            res[key] = {};
                            res[key][k] = obj[key][k];
                        }
                    }
                }
            }

            buildFinalMsg('DCA', res);
        }
    }

    observer(dc, logicDcaEdit);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('DCA edit');
    }

    getData = async () => {
        const types = ['qi', 'zo', 'ac', 'ge', 'gs', 'gp', 'se', 'ss', 'fish'];
        dcaDataTemp = await useHttp(`${state.url}/api/fis/`, 'POST', {types});
        return '';
    }

    getHtml = async () =>
        `
        <div class="dca-operation"></div>
        ${templateContainerAccordion({id: 0, title: 'dca'})}
        ${await this.getData()}
        ${dcaEdit()}
    `

}