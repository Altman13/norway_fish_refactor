import {findElement} from '../components/utils/managmentDOM/controlElement.js';

const getType = (type) => {
    let timeout;

    if (localStorage.timer) {
        const getDate = Date.now();
        const timer = new Date(localStorage.timer);

        if (timer > getDate) {
            timeout = (timer - getDate);
        } else {
            timeout = 0;
        }
    }

    localStorage.timerId = setTimeout(() => {
        findElement(`.${type}-main`)
            .setAttribute('src', '/static/icons/NG.svg');
        localStorage.removeItem('timerType');
        localStorage.removeItem('timer');
        console.log('timer');
    }, timeout);
}

if (localStorage.timerType) {
    getType(localStorage.timerType);
}

export const setTimer = (type) => {
    const timer = Date.now() + 6 * 600; // 5 minutes
    localStorage.timer = new Date(timer).toString();
    localStorage.timerType = type;
    getType(type);
}

export const stopTimer = () => {
    clearTimeout(localStorage.timerId);
    localStorage.removeItem('type');
    localStorage.removeItem('timerType');
}