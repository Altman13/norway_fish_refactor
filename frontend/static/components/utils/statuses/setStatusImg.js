import {findElement} from '../managmentDOM/controlElement.js';

const setSource = (source, img) => {
    console.log(source)
    findElement(source).setAttribute('src', `/static/icons/${img.info}.svg`);
};

export const setStatusImg = (type, img) => {
    if (type === 'AUD') {
        setSource('.info-status-img', img);
    } else {
        setSource(`.${type.toLowerCase()}-main`, img);
        setSource('.info-status-img', img);
    }

};