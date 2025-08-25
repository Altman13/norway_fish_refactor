import { state } from '../state/state.js';
import { findElement } from '../../components/utils/managmentDOM/controlElement.js';
import { checkerStatuses } from '../../utils/status/checkerStatuses.js';
import { switcherStatus } from '../../utils/status/switcherStatus.js';
import { rebuildFis } from '../../utils/rebuild/rebuildFis.js';
import { changeStatusFisOperation } from '../../components/fis/utils/changeStatusFisOperation.js';

const events = new EventSource(`${state.url}/sse`);

// events.onerror = (error) => {
//     console.log(error);
// };

events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);

    if (parsedData?.pid) {
        const closer = findElement('.updater-close');
        if (closer) {
            closer.click();
        }
    }

    if (parsedData?.CHANNEL === 'GSM') {
        findElement('.gms-status')
            .setAttribute('src', '/static/icons/GSM.svg');
    }

    if (parsedData?.CHANNEL === 'IRIDIUM') {
        findElement('.gms-status')
            .setAttribute('src', '/static/icons/Iridium.svg');
    }

    if (parsedData?.CHANNEL === 'ERROR') {
        findElement('.gms-status')
            .setAttribute('src', '/static/icons/Warning.svg');
    }

    if (parsedData?.TM === 'RET') {
        checkerStatuses(parsedData);
    }

    if (parsedData?.STATUS) {
        switcherStatus(parsedData);
    }

    if (parsedData?.TIMEPOSSTAMP) {
        const pos = parsedData.TIMEPOSSTAMP.pos;
        const date = parsedData.TIMEPOSSTAMP.date;
        findElement('.main-pos').textContent = pos;
        findElement('.main-date').textContent = date;
    }
    if (parsedData?.type === 'FIS') {
        if (parsedData.status === 'ACTIVE') {
            rebuildFis(parsedData);
        } else {
            changeStatusFisOperation(parsedData);
        }
    }

    if (parsedData?.RET) {
        checkerStatuses(parsedData);
    }

};
