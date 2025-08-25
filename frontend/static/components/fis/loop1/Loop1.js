import AbstractView from "../../../views/AbstractView.js"
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {observer} from "../../../utils/observer/observer.js";
import {useHttp} from "../../../utils/useHttp.js";
import {state} from "../../../utils/state/state.js";
import {printData} from "../../../utils/printData.js";
import {closerAccordion} from "../utils/accordionManager/closerAccordion.js";
import {createNewBlock, loopBuilder} from "../utils/builder/loopBuilder.js";
import {exitLoop, logicGe, logicTf} from "../utils/logic/logicLoop1.js";
import {findCode, findLoopElement} from "../utils/logic/find/findLoop.js";
import {displaySelection} from "../../utils/displaySelection.js";

let loop1Data;

const loop1 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop1 = async () => {
        const names = ['Velg type KVOTE', 'Velg SONE', 'Velg AKTIVITET'];
        const codes = ['qi', 'zo', 'ac'];

        loopBuilder(dc, 'loop1', 'select', names, codes);
        loop1Data.forEach((el, index) => {
            if (index < 3) {
                printData(`loop1-${index}`, el.data);
            }
        });
    }

    //console.log(loop1Data)

    window.onclick = (e) => {
        const event = e ? e.target : window.event;
        const id = Number(event.id.slice(event.id.length - 1));

        displaySelection(id, 'loop1');

        if (event.classList[0] === `btn-cancel-loop1-${id}`) {
            closerAccordion(`collapseloop1${id}`, `collapseloop1${id - 1}`)
        }

        if (event.classList[0] === `btn-send-loop1-${id}`) {
            const getValueSelect = findElement(`.datalist-loop1-${id}`);
            const getValueInput = findElement(`.input-text-loop1-${id}`);

            if (getValueSelect && getValueSelect.value) {
                const code = getValueSelect.getAttribute('code');
                if (code === 'ac') {
                    const code = findCode(loop1Data, 'ac', getValueSelect);
                    const isFound = ['FIS', 'SCR', 'SET'].indexOf(code);

                    if (isFound >= 0) {
                        const checkElement = findElement('.accordion-child-loop1-3');
                        if (checkElement === null) {
                            createNewBlock('loop1', 'Velt type REDSKAP', 'ge', 'select');
                            const getGe = findLoopElement(loop1Data, 'ge');
                            printData(`loop1-3`, getGe.data);
                        }
                    } else {
                        if (code === 'REL') {
                            logicTf(loop1Data);
                        } else {
                            exitLoop(loop1Data, 'loop1');
                            // findElement('.btn-loop1-backpage')
                            //     .click();
                        }
                    }
                }

                if (code === 'ge') {
                    logicGe(loop1Data, getValueSelect);
                }
                closerAccordion(`collapseloop1${id}`, null, `collapseloop1${id + 1}`);
            }

            if (event.classList[0] === `btn-send-loop1-6`) {
                exitLoop(loop1Data, 'loop1', ['idgsflag', 'idmeflag', 'idgoflag']);
                // findElement('.btn-loop1-backpage')
                //     .click();
            }

            if (getValueInput && getValueInput.value) {
                closerAccordion(`collapseloop1${id}`, null, `collapseloop1${id + 1}`);
            }
        }
    }

    observer(dc, logicLoop1);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop1');
    }

    getData = async () => {
        const types = ['qi', 'zo', 'ac', 'ge', 'gs'];
        loop1Data = await useHttp(`${state.url}/api/fis/`, 'POST', {types});
        return '';
    }

    getHtml = async () =>
        `
       ${await this.getData()}
       ${loop1()}
    `
}