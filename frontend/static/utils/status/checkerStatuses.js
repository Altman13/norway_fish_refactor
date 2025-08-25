import {findElement} from '../../components/utils/managmentDOM/controlElement.js';
import {state} from '../state/state.js';
import {switcherStatus} from './switcherStatus.js';

findElement('.main-login').textContent = state.LOGIN;

export const checkerStatuses = (RET) => {
    switcherStatus(RET);
};