import {templateBtn, templateCardActive, templateFis} from './templatesFis.js';
let i=0
export const insertOperation = (data) => {
    const dc = document.querySelector('.dynamic-content');

    const setName = (name) => `FISK_${i}`;
    const id = data._id;
    const date = `${data.start.YEAR}-${data.start.MONTH}-${data.start.DAY} ${data.start.HOUR}-${data.start.MIN}`;
    dc.insertAdjacentHTML('afterbegin', templateFis({
        id,
        title: setName(data),
        card: templateCardActive({
            id,
            title: setName(i++),
            status: data.status,
            date,
        }),
        type: data.type.toLowerCase(),
        btn: templateBtn({
            id,
            title: data.type,
        }),
        date
    }));
};