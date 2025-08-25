import AbstractView from "../../../views/AbstractView.js"
import {observer} from "../../../utils/observer/observer.js";
import {useHttp} from "../../../utils/useHttp.js";
import {state} from "../../../utils/state/state.js";
import {printData} from "../../../utils/printData.js";
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {createNewBlock, uCreateNewBlock} from "../utils/builder/loopBuilder.js";
import {closerAccordion} from "../utils/accordionManager/closerAccordion.js";
import {findLoopElement} from "../utils/logic/find/findLoop.js";
import {exitLoop} from "../utils/logic/logicLoop1.js";
import {regFishLogic, registrationFish} from "../../utils/registrationFish.js";
import {displaySelection} from "../../utils/displaySelection.js";

const rigthBlock = (id, dc) => {
    const names = [
        {type: 'register', value: 'Redigere fangst'},
    ];

    const codes = ['ca'];
    uCreateNewBlock(dc, 'loop4', names, codes);
    printData(`loop4-${id}`, loop4DataTemp[3].data);
}

const sildBlock = (id, dc) => {
    const names = [
        {type: 'select', value: 'Velg type SILD'}
    ];

    const codes = ['ss'];
    uCreateNewBlock(dc, 'loop4', names, codes);
    printData(`loop4-${id}`, loop4DataTemp[2].data);
}

let loop4Data;
let obData;
let loop4DataTemp;
let obList = [];

const loop4 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop4 = () => {
        const names = [
            {'type': 'select', value: 'Var det Redskapsproblemer?'}
        ];

        console.log(loop4Data);
        console.log(loop4DataTemp)
        //console.log(JSON.parse(localStorage.LOOP1))
        console.log('LOOP1', localStorage.LOOP1)
        uCreateNewBlock(dc, 'loop4', names, 'gp');
        printData(`loop4-0`, findLoopElement(loop4DataTemp, 'gp').data);
        findElement('.datalist-loop4-0')
            .setAttribute('value', loop4DataTemp[0].data[0].name);

        window.onclick = (e) => {
            const event = e ? e.target : window.event;
            const id = Number(event.id.slice(event.id.length - 1));

            displaySelection(id, 'loop4', obList);

            if (event.classList[0] === `btn-cancel-loop4-${id}`) {
                closerAccordion(`collapseloop4${id}`, `collapseloop4${id - 1}`)
            }

            if (event.classList[0].match(`reg-loop4`)) {
                const fishName = findElement(`.datalist-loop4-${id}`);
                const fishWeight = findElement(`.input-text-loop4-${id}`);

                if (fishName.value && fishWeight.value > 0) {
                    const prepareData = {
                        id,
                        type: 'loop4',
                        fishList: findLoopElement(loop4DataTemp, 'fish').data,
                        fishName: fishName,
                        fishWeight: fishWeight,
                        obList: obData ? obData.fish : [],
                        result: obList,
                    }
                    registrationFish(prepareData);
                }
            }

            if (event.classList[0] === `btn-send-loop4-${id}`) {
                if (event.classList[0] === `btn-send-loop4-0`) {
                    let loop1;

                    if (localStorage.LOOP1) {
                        loop1 = JSON.parse(localStorage.LOOP1);
                    } else {
                        loop1 = loop4Data && loop4Data.loop1 ? loop4Data.loop1 : null;
                    }

                    if (loop1 && loop1.find(get => get.flags === 'idharflag')) {
                        const names = [
                            {type: 'register', value: 'Redigere fangst'},
                            {type: 'input', value: 'Individnummer'},
                            {type: 'input', value: 'Kjonn'},
                            {type: 'input', value: 'Lengde'},
                            {type: 'input', value: 'Omkrets'},
                            {type: 'multi', value: 'Spekkmal'},
                            {type: 'input', value: 'Granatnummer'},
                            {type: 'input', value: 'Foster'}
                        ];
                        const codes = ['ca', 'in', 'se', 'le', 'ci', 'bm', 'gn', 'lf'];
                        uCreateNewBlock(dc, 'loop4', names, codes);
                        printData(`loop4-1`, loop4DataTemp[3].data);
                    } else {
                        const fl = loop1.find(get => get.flags);
                        if (loop1 && loop1.find(get => get.flags === 'idfoflag') || fl && fl.flags.find(flag => flag === 'idfoflag')) {
                            const geStatus = ['LHP', 'LHM', 'LLS', 'LLD', 'LL', 'LTL', 'LX', 'FPN', 'FPO',
                                'FYK', 'FSN', 'FWR', 'FAR', 'FIX'];
                            if (geStatus.indexOf(loop1.find(el => el.code === 'ge').stmCode)) {
                                createNewBlock('loop4', 'Registrer antall TEINER / KROK', 'fo', 'input');
                            } else {
                                createNewBlock('loop4', 'Registrer antall meter Garn', 'fo', 'input');
                            }
                        } else {
                            rigthBlock(1, dc);
                        }
                    }
                }

                if (event.classList[0] === `btn-send-loop4-1`) {
                    const checkFo = findElement('.input-text-loop1-1');

                    if (checkFo && checkFo.getAttribute('code') === 'fo') {
                        rigthBlock(2, dc);
                    }

                    const checkCa = findElement('.datalist-loop4-1');
                    const loop1 = JSON.parse(localStorage.LOOP1) || null;

                    if (checkCa && checkCa.getAttribute('code') === 'ca' && loop1.findIndex(get => get.flags === 'idharflag') < 0) {
                        if (obList.find(get => get.code === 'HER')) {
                            sildBlock(1, dc);
                        } else {
                            exitLoop(loop4DataTemp, 'loop4', null, obList);
                        }
                    }
                }

                if (event.classList[0] === `btn-send-loop4-2`) {
                    const checkSs = findElement('.datalist-loop4-2');

                    if (checkSs && checkSs.getAttribute('code') === 'ss') {
                        exitLoop(loop4DataTemp, 'loop4', 'idssflag', obList);
                    }

                    if (checkSs) {
                        if (obList.find(get => get.code === 'HER')) {
                            sildBlock(3, dc);
                        } else {
                            exitLoop(loop4DataTemp, 'loop4', null, obList);
                        }
                    }
                }

                if (event.classList[0] === `btn-send-loop4-3`) {
                    const checkSs = findElement('.datalist-loop4-3');

                    if (checkSs && checkSs.getAttribute('code') === 'ss') {
                        exitLoop(loop4DataTemp, 'loop4', 'idssflag', obList);
                    }
                }

                if (event.classList[0] === `btn-send-loop4-8`) {
                    exitLoop(loop4DataTemp, 'loop4', '', obList);
                }

                closerAccordion(`collapseloop4${id}`, null, `collapseloop4${id + 1}`);
            }
        }

    }

    observer(dc, logicLoop4);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop4');
    }

    loop4 = async () => {
        const types = ['gp', 'se', 'ss', 'fish'];
        loop4DataTemp = await useHttp(`${state.url}/api/fis/`, 'POST', {types});
        loop4Data = await useHttp(`${state.url}/api/fis/fisOne`, 'POST', {id: localStorage.fis});
        return '';
    }

    getHtml = async () =>
    `
        ${await this.loop4()}
        ${loop4()}
    `
}