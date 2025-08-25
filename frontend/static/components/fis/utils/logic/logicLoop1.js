import {findElement} from "../../../utils/managmentDOM/controlElement.js";
import {createNewBlock} from "../builder/loopBuilder.js";
import {findCode, findCodeGe, findLoopElement} from "./find/findLoop.js";
import {printData} from "../../../../utils/printData.js";
import {Enum} from "../../../../utils/enums.js";

export const exitLoop = (data, loop, flag, obList) => {
    const result = [];
    const bmObj = {};
    document.querySelectorAll(`.${loop}-exit`)
        .forEach((el, index) => {
            const codeToStm = findCode(data, `${el.getAttribute('code')}`, el);
            const code = el.getAttribute('code');
            let title;

            if (code === 'bm') {
                title = findElement(`.title-value-${loop}-${index}`).textContent.trim();
                const bmA = findElement('.input-a-text-loop4-6').value;
                const bmB = findElement('.input-b-text-loop4-6').value;
                const bmC = findElement('.input-c-text-loop4-6').value;
                bmObj.bm = `A ${bmA} B ${bmB} C ${bmC}`;
                result.push({code, title,
                    value: bmObj.bm, stmCode: codeToStm});
            } else {
                if (code) {
                    title = findElement(`.title-value-${loop}-${index}`).textContent.trim();
                    result.push({
                        code, title,
                        value: code === 'ca' ? obList : el.value, stmCode: codeToStm
                    });
                }
            }

        });

    if (flag) {
        result.push({flags: flag});
    }
    localStorage[`${loop}`.toUpperCase()] = JSON.stringify(result);
    findElement(`.btn-${loop}-backpage`)
        .click();
}

export const logicTf = (data) => {
    const checkElement = findElement('.accordion-child-loop1-3');
    if (checkElement === null) {
        createNewBlock('loop1', 'KALLESIGNAL til fartoy det pumpes FRA', 'tf', 'input');
        const next = findElement('.btn-send-loop1-3');
        next.onclick = () => {
            exitLoop(data,'loop1', 'idtfflag');
        }
    }
}

export const logicGe = (data, getValueSelect) => {
    const geStatusIf = ['TBB', 'OTB', 'PTB', 'TNB', 'TBS', 'TB',
        'OMT', 'PTM', 'TMS', 'TM', 'OTT', 'OT', 'PT', 'TY'];
    const geStatusIfNo = ['SB', 'SV', 'SDN', 'SSC', 'SPR', 'SX'];
    const geStatusIfNoNo = ['GNS', 'GND', 'GNC', 'GNF', 'GTR', 'GTN', 'GEN', 'GN'];
    const geStatusIfNoNoNo = ['LHP', 'LHM', 'LLS', 'LLD', 'LL', 'LTL', 'LX', 'FPN',
        'FPO', 'FYK', 'FSN', 'FWR', 'FAR', 'FIX'];
    const geStatusLast = ['HAR'];

    if (findCodeGe(data, 'ge', geStatusIf, getValueSelect) >= 0) {
        createNewBlock('loop1', 'Velt type TRAL', 'gs', 'select');
        createNewBlock('loop1', 'Velt type MASKEVIDDE', 'me', 'input');
        createNewBlock('loop1', 'Angi spileavstand i RIST (mm)', 'go', 'input');
        const getGs = findLoopElement(data, 'gs');
        printData(`loop1-4`, getGs.data);
    } else {
        if (findCodeGe(data, 'ge', geStatusIfNo, getValueSelect) >= Enum.ZERO) {
            createNewBlock('loop1', 'Velt type MASKEVIDDE', 'me', 'input');
            createNewBlock('loop1', 'Angi spileavstand i RIST (mm)', 'go', 'input');
        } else {
            if (findCodeGe(data, 'ge', geStatusIfNoNo, getValueSelect) >= Enum.ZERO) {
                // localStorage.IDFOFLAG = true;
                createNewBlock('loop1', 'Velt type MASKEVIDDE', 'me', 'input');
                createNewBlock('loop1', 'Angi spileavstand i RIST (mm)', 'go', 'input');
            } else {
                if (findCodeGe(data, 'ge', geStatusIfNoNoNo, getValueSelect) >= Enum.ZERO) {
                    exitLoop(data, 'loop1', 'idfoflag');
                    console.log(4)
                    // cancel.click();
                } else {
                    if (findCodeGe(data, 'ge', geStatusLast, getValueSelect) >= Enum.ZERO) {
                        exitLoop(data, 'loop1', 'idharflag');
                        // cancel.click();
                        console.log(5)
                    } else {
                        exitLoop(data, 'loop1');
                        // cancel.click();
                        console.log(6)
                    }
                }
            }
        }
    }
}