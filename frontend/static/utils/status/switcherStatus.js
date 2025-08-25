import {useHttp} from '../useHttp.js';
import {state} from '../state/state.js';
import {setStatusImg} from '../../components/utils/statuses/setStatusImg.js';
import {audStatus} from './audStatus.js';

export const checkAnswer = (flags, TM, RS, cancel) => {
    if (flags && flags.isSync) {
        if (flags.isAsync) {
            if (RS === 'ACK') {
                if (cancel) {
                    setStatusImg(TM, {main: 'Grey', info: 'Grey'});
                } else {
                    setStatusImg(TM, {main: 'OK', info: 'OK'});
                }
            } else if (RS === 'NAK') {
                setStatusImg(TM, {main: 'NG', info: 'NG'});
            }
        } else {
            setStatusImg(TM, {main: 'Warning', info: 'Warning'});
        }
    } else {
        setStatusImg(TM, {main: 'Waiting', info: 'Waiting'});
    }
};

const isCancel = (record) => record ? record.RE === '522' : false;

export const switcherStatus = (msg, ready) => {
    if (ready && msg && msg.stm32) {
        const TM = msg.stm32.TM;
        const lastRecord = msg.RET ? msg.RET[msg.RET.length - 1] : undefined;
        const RS = lastRecord ? lastRecord.RS : undefined;
        checkAnswer(msg.flags, TM, RS, isCancel(lastRecord));
    } else {
        if (msg.STATUS === 'Waiting') {
            if (msg.TM === 'AUD') {
                audStatus();
            } else {
                checkAnswer(null, msg.TM);
            }
        } else if (msg.STATUS === '503 FD' || msg.STATUS === '522 FD') {
            useHttp(`${state.url}/api/main/`, 'POST', {data: msg.RN})
                .then(data => {
                    console.log(data)
                    setStatusImg(data.TM, {main: 'NG', info: 'NG'});
                    location.reload()
                });
        } else {
            if (msg.data) {
                const RN = msg.data ? msg.data.RN : msg.RN;
                const RS = msg.data ? msg.data.RS : undefined;
                useHttp(`${state.url}/api/main/`, 'POST', {data: RN})
                    .then(data => {
                        checkAnswer(data.flags, data.TM, RS, isCancel(msg.data));
                    });
            } else {
                if (msg.RN) {
                    useHttp(`${state.url}/api/main/`, 'POST', {data: msg.RN})
                        .then(data => {
                            checkAnswer(data.flags, data.TM);
                        });
                }
            }
        }
    }
};