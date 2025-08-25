import AbstractView from "../../../views/AbstractView.js"
import {observer} from "../../../utils/observer/observer.js";
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {calculateDU} from "../../utils/managmentTime/calculateDU.js";
import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";
import {createNewBlock, uCreateNewBlock} from "../utils/builder/loopBuilder.js";
import {closerAccordion} from "../utils/accordionManager/closerAccordion.js";
import {displaySelection} from "../../utils/displaySelection.js";

const loop3 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop3 = () => {
        const names = [
            {type: 'pos', value: 'Fiskestart - Posisjon'},
            {type: 'date', value: 'Fiskestart - Dato og Tid'},
            // {type: 'input3', value: 'Dybde ved Fiskestart'},
            // {type: 'pos', value: 'Fiskestopp - Posisjon'},
            // {type: 'date', value: 'Fiskestopp - Dato og Tid'},
            // {type: 'input3', value: 'Dybde ved Fiskestopp'},
        ]

        uCreateNewBlock(dc, 'loop3', names);

        window.onclick = (e) => {
            console.log('e', e)
            const event = e ? e.target : window.event;
            const id = Number(event.id.slice(event.id.length - 1));

            displaySelection(id, 'loop3');

            if (event.classList[0] === `btn-cancel-loop3-${id}`) {
                closerAccordion(`collapseloop3${id}`, `collapseloop3${id - 1}`);
            }

            if (event.classList[0] === `btn-send-loop3-${id}`) {
                console.log('btn-send-loop3 ' + `${id}`)
                if (event.classList[0] === `btn-send-loop3-1`) {
                    const esFlag = false;

                    if (esFlag) {
                        console.log('esFlag', esFlag)
                        createNewBlock('loop3', 'Dybde ved Fiskestart', null, 'input3');
                    } else {
                        console.log('esFlag' +' false')
                        createNewBlock('loop3', 'Fiskestopp - Posisjon', null, 'pos');
                        createNewBlock('loop3', 'Fiskestopp - Dato og Tid', null, 'date');
                    }
                }

                if (event.classList[0] === `btn-send-loop3-3`) {
                    const esFlag = false;
                    if (esFlag) {
                        createNewBlock('loop3', 'Dybde ved Fiskestopp', null, 'input3');
                    } else {
                        const start = findElement('.datetime-loop3-1').value;
                        const stop = findElement('.datetime-loop3-3').value;

                        const loop3 = {
                            LT: findElement('.input-bredde-loop3-0').value,
                            LG: findElement('.input-lendge-loop3-0').value,
                            BD: formatDate(new Date(start)).getDate,
                            BT: formatDate(new Date(start)).getTime,
                            XT: findElement('.input-bredde-loop3-2').value,
                            XG: findElement('.input-lendge-loop3-2').value,
                            FINISH: stop,
                            DU: calculateDU(new Date(start), new Date(stop)),
                        }
                        console.log(loop3)
                        localStorage.LOOP3 = JSON.stringify(loop3);
                        window.location.href = '/loop2';
                    }
                }
                closerAccordion(`collapseloop3${id}`, null, `collapseloop3${id + 1}`);
            }
        }

    }

    observer(dc, logicLoop3);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop3');
    }

    getHtml = async () =>
    `
        ${loop3()}      
    `
}