import AbstractView from '../../views/AbstractView.js';
import { observer } from '../../utils/observer/observer.js';
import { useHttp } from '../../utils/useHttp.js';
import { state } from '../../utils/state/state.js';
import { printData } from '../../utils/printData.js';
import { createElement, findElement } from '../utils/managmentDOM/controlElement.js';
import { formatDate } from '../../utils/patternDateTime/formatDateTime.js';
import { setFlagsToSend } from '../utils/flags/setFlagsToSend.js';
import { uCreateNewBlock } from '../fis/utils/builder/loopBuilder.js';
import { closerAccordion } from '../fis/utils/accordionManager/closerAccordion.js';
import { registrationFish, updaterWeightFish } from '../utils/registrationFish.js';
import { loadTemplatePos } from '../utils/loadTemplatePos.js';
import { displaySelection } from '../utils/displaySelection.js';
import { sendToServer } from '../utils/sendToServer.js';

export const printDataTemp = (id, data) => {
    const dataList = document.getElementById(`datalistOptions-${id}`);
    console.log('dataList', dataList)
    if (dataList) {
        data.forEach(item => {
            dataList.append(createElement('option',
                `${item.navn}`,
                {
                    text: item.navn.trim(),
                    optionValue: item.navn.trim(),
                }));
        });
    }
};

const templateModal = () =>
    `
        <button type="button" class="btn btn-primary modal-window" 
            data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
        
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" 
            data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-uppercase" id="staticBackdropLabel">Kansellering!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">Vil du kansellere DEP melding?</div>
                    <div class="dep-cancel-title d-flex justify-content-center"></div>
                    <div class="modal-footer">
                        <a href="/" type="button" class="btn-modal-dep-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                        <a href="/" type="button" class="btn-modal-dep-confirm btn btn-outline-success text-uppercase" data-bs-dismiss="modal" data-link>Bekreft</a>
                    </div>
                </div>
            </div>
        </div>
    `;

export const templateSystemBusyModal = () =>
    `
        <button type="button" class="btn btn-primary modal-window" 
            data-bs-toggle="modal" data-bs-target="#staticBackdrop"></button>
        
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" 
            data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-uppercase" id="staticBackdropLabel">System is busy with other message!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="dep-cancel-title d-flex justify-content-center"></div>
                    <div class="modal-footer">
                        <a href="/" type="button" class="btn-modal-dep-cancel btn btn-danger text-uppercase" data-bs-dismiss="modal" data-link>Tilbake</a>
                    </div>
                </div>
            </div>
        </div>
    `;



export const checkCode = (list, type, value) => {
    const findCode = (list, elem) => list.find(type => String(type.name).trim() === elem);

    if (type === 'po') {
        return findCode(list.ports, value)?.code;
    } else if (type === 'ds') {
        return findCode(list.fish, value)?.code;
    } else if (type === 'ac') {
        return findCode(list.activity, value)?.code;
    } else {
        return null;
    }
};
let fav;
let depDataTemp;
let lastDep;
let isSendMsg;

const dep = () => {

    let obData;
    let logicDep;
    let obList = [];


    const dc = document.querySelector('.dynamic-content');

    const flags = lastDep && lastDep.flags ? lastDep.flags : lastDep;
    const isSend = isSendMsg.send | false;
    const RET = lastDep && lastDep.RET ? lastDep.RET[lastDep.RET.length - 1] : undefined;

    if (isSend === false || isSend === 0) {
        console.log('flags', flags)
        console.log('RET', RET)
        if (flags && flags.isAsync &&
            !flags.isCancel && RET && RET.RS === 'ACK' ||
            RET && +RET.RE === 522 && RET.RS === 'NAK') {
            logicDep = () => {
                dc.innerHTML = templateModal();
                const modalWindow = findElement('.modal-window');
                modalWindow.click();
                modalWindow.style.visibility = 'hidden';

                findElement('.dep-cancel-title')
                    .textContent = `${lastDep.stm32.TM} ${formatDate(new Date(lastDep.createdAt)).getFullSep}`;

                const confirm = findElement('.btn-modal-dep-confirm');

                lastDep.flags = setFlagsToSend(true);

                confirm.onclick = () => {
                    const finalMsg = {
                        'req': { 'req': `DATIPOS DEPCANCEL ${lastDep._id}` },
                        'data': {
                            'TM': 'DEP',
                            'RN': lastDep._id,
                        }
                    };

                    const updateFlags = {
                        'RN': lastDep._id,
                        'flags': lastDep.flags,
                    };

                    useHttp(`${state.url}/api/dep/`, 'PUT', updateFlags)
                        .then(d => console.log(d));

                    useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
                        .then(d => console.log(d));
                };
            };
        } else {
            logicDep = () => {
                const names = [
                    { type: 'select', value: 'Avgang Havn' },
                    { type: 'select', value: 'Malart' },
                    { type: 'register', value: 'Kvantum ombor' },
                    { type: 'date', value: 'Fiskestart-Dato og Tid' },
                    { type: 'tposDep', value: 'Fiskestart - Posisjon' },
                    { type: 'select', value: 'Planlagt aktivitet' },
                    { type: 'date', value: 'Avgang Dato og Tid' }];
                const codes = ['po', 'ds', 'ob', 'pdt', 'lao', 'ac', 'zdt'];

                uCreateNewBlock(dc, 'dep', names, codes);

                printData('dep-0', depDataTemp.ports);
                printData('dep-1', depDataTemp.fish);
                printData('dep-2', depDataTemp.fish);
                printData('dep-5', depDataTemp.activity);
                printDataTemp('dep-4', fav);

                loadTemplatePos({ id: 4, title: 'dep', fav });

                window.onclick = (e) => {
                    const event = e ? e.target : window.event;
                    const id = Number(event.id.match(/\d+/g));
                    console.log(obList)
                    displaySelection(id, 'dep', obList);

                    if (event.classList[0] === `btn-cancel-dep-${id}`) {
                        closerAccordion(`collapsedep${id}`, `collapsedep${id - 1}`);
                    }

                    else if (event.classList[0] === 'reg-dep-2') {
                        const fishName = findElement('.datalist-dep-2');
                        console.log('fishName', fishName)
                        const fishWeight = findElement('.input-text-dep-2');

                        if (fishName.value && fishWeight.value > 0) {
                            const prepareData = {
                                id: 2,
                                type: 'dep',
                                fishList: depDataTemp.fish,
                                fishName: fishName,
                                fishWeight: fishWeight,
                                obList: obData ? obData.fish : [],
                                result: obList,
                            };
                            console.log(fishName)
                            registrationFish(prepareData);
                        }
                        if (fishName.value && fishWeight.value > 0) {
                            const prepareData = {
                                id: 2,
                                type: 'dep',
                                fishList: depDataTemp.fish,
                                fishName: fishName,
                                fishWeight: fishWeight,
                                obList: obData ? obData.fish : [],
                                result: obList,
                            };
                            registrationFish(prepareData);
                        };
                    }
                    else if  (event.classList[0] === `delete-id-${id}`) {
                    const fishName = findElement('.datalist-dep-2');
                    const fishWeight = findElement('.input-text-dep-2');
                    const fishListOnTheBoard =findElement(`.tr-id-${id}`);
                    console.log('fishListOnTheBoard', fishListOnTheBoard)
                    // const test = findElement(`.fish-on-board-${id}`);
                    // console.log('test', test)
                    // test.remove()
                    console.log(obList)
                    console.log(obData)
                    console.log('id '+id)
                    for( var i = 0; i < obList.length; i++){ 
    
                        if ( obList[i].id === id) { 
                            console.log('splice')
                            obList.splice(i, 1); 
                        }
                    
                    }
                    // obList=obList.forEach(element => {
                    //     if(element.id===id){
                    //         console.log(element)
                    //         delete obList.element
                    //     }
                            
                    // });
                    console.log('removedObList', obList)
                    console.log('fishListOnTheBoard', fishListOnTheBoard)
                    fishListOnTheBoard.remove()
                    //if (event.classList[0].match('dep-weight')) {
                    ///    updaterWeightFish(id, 'dep', newObList, event);
                    }
                    else if (event.classList[0] === `btn-send-dep-${id}`) {
                        console.log('obList', obList)
                        if(!obList || obList.length===0){
                            console.log('obList== 0')
                            obList.push({code: '', id: '', name: '', weight: ''})
                        }else{
                            console.log('obList != 0' )
                        }
                        console.log('obList', obList)
                        sendToServer({ id, last: 6 }, 'dep', { ob: obList }, depDataTemp);
                    }
                }
            }
        }
    } 
    // else {
    //     logicDep = () => {
    //         dc.innerHTML = templateSystemBusyModal();
    //         const modalWindow = findElement('.modal-window');
    //         modalWindow.click();
    //         modalWindow.style.visibility = 'hidden';
    //     };
    // }

    observer(dc, logicDep);
    return '';
};

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle('DEP');
    }

    getData = async () => {
        fav = await useHttp(`${state.url}/api/fav`);
        depDataTemp = await useHttp(`${state.url}/api/dep/`);
        isSendMsg = await useHttp(`${state.url}/api/main/check-send`);
        lastDep = await useHttp(`${state.url}/api/main/checking-status`, 'POST', { type: 'DEP' });
        console.log('lastDep', lastDep)
        return '';
    }

    getHtml = async () =>
        `       
       ${await this.getData()}
       ${dep()}
    `;
}