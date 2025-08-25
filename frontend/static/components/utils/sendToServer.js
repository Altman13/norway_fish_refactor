import { checkCode } from '../dep/Dep.js';
import { closerAccordion } from '../fis/utils/accordionManager/closerAccordion.js';
import { buildFinalMsg } from '../fis/utils/buildFinalMsg.js';
import { templateSendButton } from '../fis/utils/components/components.js';
import { findElement } from './managmentDOM/controlElement.js';

const finalMsg = {};
//TODO : разобраться с мусором в сообщениях глобально!
const setFinalMsg = (stmCode, code, title, value) => {
    finalMsg[stmCode] = {
        stmCode,
        title,
        value,
        code
    };
};

export const sendToServer = (id, type, list, listAllData) => {
    const _id = id.id;
    console.log(_id+' '+type)
    const input = findElement(`.show-title-${type}-${_id}`);
    console.log('input', input)
    const title = findElement(`.title-value-${type}-${_id}`)?.textContent.trim();
    const stmCode = input.getAttribute('code');
    const codes = ['ob', 'kg', 'ca', 'lao'];

    if (input.value) {
        if (stmCode === 'lao' || stmCode === 'xtg') {
            const bredde = findElement(`.input-bredde-${type}-${_id}`);
            const lendge = findElement(`.input-lendge-${type}-${_id}`);
            setFinalMsg(stmCode, '', title, `${bredde.value} ${lendge.value}`);
        } else {
            const code = checkCode(listAllData, stmCode, input.value);
            setFinalMsg(stmCode, code, title, input.value);
        }
        closerAccordion(`collapse${type}${_id}`, null, `collapse${type}${_id + 1}`);
    } else {
        if (codes.findIndex(c => c === stmCode) < -1) {
            alert('Field is empty!');
        } else {
            if (stmCode === 'ob' || stmCode === 'kg' || stmCode === 'ca') {
                setFinalMsg(stmCode, '', title, list[stmCode]);
            }

        }
        closerAccordion(`collapse${type}${_id}`, null, `collapse${type}${_id + 1}`);
    }

    if (_id === id.last) {
        console.log('id',_id+' '+id.last)
        if (Object.keys(finalMsg).length <= id.last) {
            alert('Please check all field!');
            
        } else {
            const dc = document.querySelector('.dynamic-content');
            const send = findElement(`.btn-send-${type}-888`);
            if (!send) {
                dc.insertAdjacentHTML('beforeend', templateSendButton({ id: 888, title: type }));
            }

        }
    }

    const send = findElement(`.btn-send-${type}-888`);

    if (send) {
        send.onclick = () => {
            let getStart;
            let getDepart;
            if (type === 'por') {
                //заход в порт
                const portEntry = finalMsg.dhl.value;
                //выгрузка
                const landing = finalMsg.pdt.value;
                console.log('portEntry :>> ', portEntry);
                console.log('landing :>> ', landing);


                const portEntryTimeTra = new Date(portEntry).getTime();
                console.log('portEntryTimeTra', portEntryTimeTra)
                const landingTimeTra = new Date(landing).getTime();
                console.log('landingTimeTra', landingTimeTra)

                const portEntryTimeDiffFromNow = portEntryTimeTra- Date.now()
                console.log('portEntryTimeDiffFromNow', portEntryTimeDiffFromNow)
                const landingTimeDiffFromNow = landingTimeTra-Date.now()
                console.log('landingTimeDiffFromNow', landingTimeDiffFromNow)
                if(finalMsg?.xtg){
                    delete finalMsg.xtg
                }
                if (landingTimeTra > portEntryTimeTra &&
                    portEntryTimeDiffFromNow>0 && landingTimeDiffFromNow>0 ) {
                        buildFinalMsg(type.toUpperCase(), finalMsg);
                } else {
                    //TODO: дописать текст на алерт
                    alert('PDT must be > Now');
                    return
                }
            }
            else if (type === 'dep') {
                getStart = finalMsg.pdt.value;
                getDepart = finalMsg.zdt.value;
                const startFish = new Date(getStart).getTime();
                console.log('startFish :>> ', startFish);
                const startDepart = new Date(getDepart).getTime();
                console.log('startDepart :>> ', startDepart);
                const result = startFish - startDepart ;
                console.log('result', result)
                const dateDiffNow = startDepart-Date.now()
                console.log('dateDiffNow', dateDiffNow)
                //TODO: обязательно разобраться откуда в сообщении лишние поля!
                if(finalMsg?.tt){
                    delete finalMsg.tt
                }
                if(finalMsg?.tf){
                    delete finalMsg.tf
                }
                if(finalMsg?.kg){
                    delete finalMsg.kg
                }
                if(finalMsg?.xtg){
                    delete finalMsg.xtg
                }
                console.log('finalMsg', finalMsg)
                if (result && result >= 0 && dateDiffNow>=7200000) {
                    buildFinalMsg(type.toUpperCase(), finalMsg);
                } else {
                    alert('PDT must be > ZDT by 2 hours');
                    return
                }
            }
            else if (type === 'tra') {
                //TODO : разобраться с логикой обработки времени при перебросе рыбы
                // с борта на борт
                getStart = finalMsg.pdt.value;
                //getDepart = finalMsg.zdt.value;
                if(finalMsg?.ac){
                    delete finalMsg.ac
                }
                if(finalMsg?.po){
                    delete finalMsg.po
                }
                if(finalMsg?.ds){
                    delete finalMsg.ds
                }
                const startTime = new Date(getStart).getTime();
                const startTimeTra = new Date(startTime).getTime();
                console.log('startTimeTra', startTimeTra)
                const dateDiffNow = Date.now()- startTimeTra
                console.log('dateDiffNow', dateDiffNow)
                if (dateDiffNow<=0) {
                    buildFinalMsg(type.toUpperCase(), finalMsg);
                } else {
                    alert('PDT must be > Now');
                    return
                }
            }
            else if (type === 'coe') {
                console.log('COE message', finalMsg)        
                getStart = finalMsg.pdt.value;
                //getDepart = finalMsg.zdt.value;
                const startFish = new Date(getStart).getTime();
                console.log('startFish :>> ', startFish);
                const startDepart = new Date(getDepart).getTime();
                console.log('startDepart :>> ', startDepart);
                const result = startFish - startDepart ;
                console.log('result', result)
                const dateDiffNow = startDepart-Date.now()
                console.log('dateDiffNow', dateDiffNow)
                // finalMsg.DA ='20220330',
                // finalMsg.XT ='N6804',
                // finalMsg.XG ='E00002',
                // finalMsg.TT ='LLLL',
                // if (result && result >= 0 && dateDiffNow>=7200000) {
                    if(finalMsg?.ltg){
                        delete finalMsg.ltg
                    }
                    // if(finalMsg?.xtg){
                    //     delete finalMsg.xtg
                    // }
                    buildFinalMsg(type.toUpperCase(), finalMsg);
                // } else {
                //     alert('PDT must be > ZDT by 2 hours');
                // }
            }
            else if (type === 'cox') {
                
                const mainpos = findElement('.main-pos').innerHTML;
                console.log('mainpos', mainpos)
                var XT  = mainpos.slice(0, 8) 
                var LG  = mainpos.slice(8, 19)
                console.log('XT', XT)
                console.log('LG', LG) 
                //getStart = finalMsg.pdt.value;
                // getDepart = finalMsg.zdt.value;
                // const startFish = new Date(getStart).getTime();
                // console.log('startFish :>> ', startFish);
                // const startDepart = new Date(getDepart).getTime();
                // console.log('startDepart :>> ', startDepart);
                // const result = startFish - startDepart ;
                // console.log('result', result)
                // const dateDiffNow = startDepart-Date.now()
                // console.log('dateDiffNow', dateDiffNow)
                // finalMsg.DA ='20220330',
                finalMsg.XT ='N6804';
                finalMsg.XG ='E00002';
                console.log('COX message-=> ' , finalMsg)
                // finalMsg.TT ='LLLL',
                // if (result && result >= 0 && dateDiffNow>=7200000) {

                    if(finalMsg?.po){
                        delete finalMsg.po
                    }
                    if(finalMsg?.ds){
                        delete finalMsg.ds
                    }
                    if(finalMsg?.pdt){
                        delete finalMsg.pdt
                    }
                    if(finalMsg?.lao){
                        delete finalMsg.lao
                    }
                    if(finalMsg?.zdt){
                        delete finalMsg.zdt
                    }
                    // if(finalMsg?.xtg){
                    //     delete finalMsg.xtg
                    // }

                    buildFinalMsg(type.toUpperCase(), finalMsg);
                // } else {
                //     alert('PDT must be > ZDT by 2 hours');
                // }
            }
            console.log('history back')
            window.history.back()
        };
    }
};