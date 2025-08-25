import {findElement} from '../../utils/managmentDOM/controlElement.js';

export const setInactivaOperation = (data) => {
    const cancel = findElement(`.btn-cancel-${data.type}-${data._id}`);
    cancel.textContent = 'Edit';
    cancel.setAttribute('class', 'w-100 btn-cancel btn btn-outline-primary text-uppercase');
    cancel.setAttribute('href', '/loop2');

    const setImg = document.querySelector(`.status-img-${data._id}`);
    if (data.status === 'INACTIVE') {
        setImg.setAttribute('src', '/static/icons/Warning.svg');
    } else if (data.status === 'READY') {
        setImg.setAttribute('src', '/static/icons/OK.svg');
    } else if (data.status === 'ACTIVE') {
        setImg.setAttribute('src', '/static/icons/Fish.svg');
    }

    cancel.onclick = () => {
        localStorage.fis = data._id;
    };
};