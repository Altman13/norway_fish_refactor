import {state} from '../../../utils/state/state.js';
import {setFlagsToSend} from '../../utils/flags/setFlagsToSend.js';
import {useHttp} from '../../../utils/useHttp.js';
import {findElement} from '../../utils/managmentDOM/controlElement.js';

export const buildFinalMsg = (type, msg) => {
    let finalMsg = {
        'req': {'req': `DATIPOS ${type.toUpperCase()}`},
        'data': {
            'TM': type.toUpperCase(),
            'AD': 'NOR',
            'RC': 'RCSIG27',
            'AC': 'STE',
            'MA': state.LOGIN.toUpperCase(),
           ...msg,
        },
        flags: setFlagsToSend(true),
    };

    console.log('ffff-=> ', JSON.stringify(finalMsg));

    useHttp(`${state.url}/api/main/system-flag`, 'POST', {status: {send: true}})
        .then(() => {});

    useHttp(`${state.url}/api/stm32/send`, 'POST', finalMsg)
        .then(() => {
            //finalMsg = {}
        });

    // globalCancelBtn.click();
};