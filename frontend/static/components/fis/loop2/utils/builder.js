import {findElement} from "../../../utils/managmentDOM/controlElement.js";
import {toDate} from "../../../submenu/utils/toDate.js";
import {toPosition} from "../../../submenu/utils/toPosition.js";
import {printData} from "../../../../utils/printData.js";
import {formatDate} from "../../../../utils/patternDateTime/formatDateTime.js";

export const buildPageLoop2 = (data) => {
    setTitle(data);
    setLoop1(data);
    setLoop3(data);
    setLoop4(data);
}

const setTitle = (name) => {
    const title = findElement('.fis-operation-title');
    //title.textContent = `${name.type}_${name._id} ${toDate(name.start)}`;
}

const setLoop4 = (data) => {
    setLoop('loop4', data);
}

const setLoop3 = (data) => {
    const start = findElement('.start-fis');
    const stop = findElement('.stop-fis');
    const du = findElement('.du-fis');
    let getLoops;

    if (data && data.loops) {
        getLoops = data.loops.find(el => el.type === 'loop3');
    }

    const loop3Builder = (data) => {
        start.textContent = `${data.LT} ${data.LG} ${toDate(`${data.BD} ${data.BT}`)}`;
        stop.textContent = `${data.XT} ${data.XG} ${formatDate(new Date(data.FINISH)).getFullSep}`;
        du.textContent = `${data.DU}`;
    }

    let loop3;

    if (localStorage.LOOP3) {
        loop3 = JSON.parse(localStorage.LOOP3);
        loop3Builder(loop3);
    } else if (getLoops && getLoops.value) {
        loop3Builder(getLoops.value);
    } else {
            start.textContent = `${toPosition(data.start)} ${toDate(data.start)}`;
            stop.textContent = `${toPosition(data.stop)} ${toDate(data.stop)}`;
            du.textContent = `${data.DU}`
    }
}

const setLoop = (loop, data) => {
    let loop1;
    let getLoops;

    if (data && data.loops) {
        getLoops = data.loops.find(el => el.type === loop)?.value;
    }

    // if (data && getLoops) {
    //     loop1 = getLoops;
    // } else {
    //     loop1 = localStorage[`${loop}`.toUpperCase()] ? JSON.parse(localStorage[`${loop}`.toUpperCase()]) : null;
    // }

    if (localStorage[`${loop}`.toUpperCase()]) {
        loop1 = JSON.parse(localStorage[`${loop}`.toUpperCase()]);
    } else {
        loop1 = getLoops ? getLoops : null;
    }

    const insert = findElement(`.insert-${loop}-loop2`);
    if (loop1) {
        loop1.reverse();
        loop1.forEach((el, index) => {
            if (el.title) {
                console.log(el)
                insert.insertAdjacentHTML('afterbegin', templateField({
                    id: index,
                    title: el.title,
                    value: el.code === 'ca' ? `${el.value.map(e => `${e.name} ${e.weight}`).join(' ')}` : el.value,
                }))
            }
        });
    } else {
        const html = `${loop}`.toUpperCase();
        insert.insertAdjacentHTML("afterbegin", `<h4>${html}</h4>`);
    }
}

const setLoop1 = (data) => {
    setLoop('loop1', data);
}

export const createLoop1Field = async (data) => {
    const dc = document.querySelector('.dynamic-content');
    let temp;
    if (typeof data.data === 'string') {
        temp = await template({id: data.id, title: data.title}, await templateInput({
            id: data.id,
            title: data.title,
            code: data.type
        }));
        dc.insertAdjacentHTML('beforeend', temp);
    } else {
        temp = await template({id: data.id, title: data.title}, await templateSelect({
            id: data.id,
            title: data.title,
            code: data.type
        }));
        dc.insertAdjacentHTML('beforeend', temp);
        printData(`loop1-${data.id}`, data.data);
    }
}

const templateField = (data) =>
    `
        <div class="my-3 d-flex">
            <p class="loop2-title-${data.id} card-title-6 fw-bold me-1 text-uppercase">${data.title}:</p>
            <p class="loop2-value-${data.id} card-text-6">${data.value}</p>
        </div>
    `

const template = async (data, template) =>
    `
        <div class="accordion-loop1-${data.id} accordion-item mb-3">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button class="loop1-outer-${data.id} LOOP1-title accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" 
                aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    ${data.title}
                </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="loop1-inner-${data.id} accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                <div class="accordion-body">
                    ${template}        
                </div>
            </div>
            <div class="btn-group-${data.id} btn-group mt-3 btn-group-lg d-flex justify-content-center" role="group"
            aria-label="Basic example">
                <button type="button" id="${data.id}" class="btn-cancel-loop1-id-${data.id} btn-cancel btn btn-outline-danger">Tilbake</button>
                <button type="button" id="${data.id}" class="btn-send-loop1-id-${data.id} btn-send btn btn-outline-success">Neste</button>
            </div>   
        </div>
    `

const templateInput = async (data) =>
    `
        <div class="input-group mb-3">           
            <input type="text" class="input-text-loop1-${data.id} loop1-exit show-title-loop1-${data.id} loop1-forms form-control" 
            placeholder="Free text" aria-label="FreeText" title="${data.title}" code="${data.code ? data.code : ''}">                                        
        </div>
    `

const templateSelect = async (data) =>
    `
        <input class="datalist-loop1-${data.id} loop1-exit show-title-loop1-${data.id} loop1-forms form-control" 
        list="datalistOptions-loop1-${data.id}" title="${data.title}" code="${data.code ? data.code : ''}" id="fis-loop1-${data.id}">
        <datalist id="datalistOptions-loop1-${data.id}"></datalist> 
    `