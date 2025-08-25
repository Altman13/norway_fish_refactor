import {createElement, findElement} from "../../utils/managmentDOM/controlElement.js";
import {useHttp} from "../../../utils/useHttp.js";
import {state} from "../../../utils/state/state.js";
import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";

let dcaDataTemp;

const loadData = async () => {
    const types = ['qi', 'zo', 'ac', 'ge', 'gs', 'gp', 'se', 'ss', 'fish'];
    dcaDataTemp = await useHttp(`${state.url}/api/fis/`, 'POST', {types});
}

const codeMapping = (code, value) => {
    const getCode = dcaDataTemp.find(get => get.type === code);
    if (getCode) {
        return getCode.data.find(get => String(get.code) === value);
    }
}

// dcaBuilder duplicated code need refactoring
const codeCaToName = (record) => {
    let splitRecArr;
    if (Array.isArray(record)) {
        splitRecArr = record.join(' ').match(/\w{3}\s\d+/gm);
    } else {
        splitRecArr = record.match(/\w{3}\s\d+/gm);
    }
    const temp = {};
    const result = [];

    splitRecArr.forEach(el => {
        const codeName = el.replace(/\d+/, '').trim();
        const getFish = dcaDataTemp.find(get => get.type === 'fish');
        temp.name = getFish.data.find(get => get.code === codeName)?.name
        temp.weight = el.replace(/\w+/, '').trim();
        result.push(JSON.parse(JSON.stringify(temp)));
    });

    return result;
}

const nameMapping = (key, value) => {
    let name = codeMapping(key.toLowerCase(), value)?.name;
    switch (key) {
        case 'MA':
            key = 'Operator';
            break;
        case 'DATI':
            key = 'Departure date';
            break;
        case 'QI':
            key = 'Velg type kvote';
            break;
        case 'AC':
            key = 'Velg aktivitet';
            break;
        case 'ZO':
            key = 'Velg sone';
            break;
        case 'GE':
            key = 'Velg type redskap';
            break;
        case 'GS':
            key = 'Velg type tral';
            break;
        case 'ME':
            key = 'Velg type maskevidde';
            break;
        case 'GO':
            key = 'Angi spileavstand i RIST (mm)';
            break;
        case 'GP':
            key = 'Var det redskapsproblemer?';
            break;
        case 'CA':
            key = 'Redigere fangst';
            break;
        case 'DU':
            key = 'Difference';
            break;
        case 'LTG':
            key = 'Width/Longitude departure positions';
            break;
        case 'BDT':
            key = 'Date/time';
            break;
        case 'XTG':
            key = 'Width/Longitude positions of the end of the fishing operation';
            break;
    }

    return {key, name};
}

const appendData = (key, val, where) => {
    const tr = createElement('tr', '');
    const style = key === 'Block B' ? 'color: black; font-size: 18px' : 'color: #0d6efd'
    tr.append(createElement('td', `td-key-${key}`, {text: nameMapping(key).key, style}));
    if (key === 'CA') {
        if (Array.isArray(val)) {
            tr.append(createElement('td', `td-value-${val} text-end`,
                {text: val.map(el => `${el.name} ${el.weight}`)}));
        } else {
            tr.append(createElement('td', `td-value-${val} text-end`,
                {text: val}));
        }
    } else {
        tr.append(createElement('td', `td-value-${val} text-end`,
            {text: nameMapping(key, val)?.name ? nameMapping(key, val).name : val}));
    }

    where.append(tr);
}

export const insertOriginalDcaEditMsg = async (dca) => {
    await loadData();

    const table = findElement(`.table-archive-${dca._id}`);
    const build = createElement('tbody', `tbody-values-${dca._id}`);
    delete dca.stm32.id;
    delete dca.stm32.AD;

    const lDca = dca.stm32_edit ? dca.stm32_edit : dca.stm32;
    if (lDca.QI) {
        lDca.QI = String(lDca.QI);
    }

    for (const key in lDca) {
        const val = lDca[key];
        if (key.match('blockB')) {
            appendData('Block B', '', build);
            for (const k in val) {
                if (k === 'CA') {
                    val[k] = val[k].join(' ');
                }
                appendData(k, val[k], build);
            }
        } else {
            appendData(key, val, build);
        }
    }
    table.append(build);
}

export const insertOriginalDcaMsg = async (dca) => {
    await loadData();

    const table = findElement(`.table-archive-${dca._id}`);
    const build = createElement('tbody', `tbody-values-${dca._id}`);
    delete dca.stm32.id;
    delete dca.stm32.AD;

    const lDca = dca.stm32_edit ? dca.stm32_edit : dca.stm32;
    if (lDca.QI) {
        lDca.QI = String(lDca.QI);
    }

    for (const key in lDca) {
        const val = lDca[key];
        if (key.match('blockB')) {
            appendData('Block B', '', build);
            for (const k in val) {
                if (k === 'CA') {
                    val[k] = codeCaToName(val[k]);
                }
                appendData(k, val[k], build);
            }
        } else {
            appendData(key, val, build);
        }
    }
    table.append(build);
}

export const insertCancelMsg = (data) => {
    console.log(data)
    const table = findElement(`.table-archive-${data.msg._id}`);
    const build = createElement('tbody', `tbody-values-${data.msg._id}`);

    data.msg.originalMsg.RN = data.msg._id;
    data.msg.originalMsg.DATI = data.msg.stm32_cancel.DATI;
    data.msg.originalMsg.RE = data.msg.stm32_cancel.RE;
    for (let key in data.msg.originalMsg) {
        const val = data.msg.originalMsg[key];

        const tr = createElement('tr', '');
        console.log(key)
        if (key === 'TM' || key === 'MA' || key === 'RN') {
            tr.append(createElement('td', `td-key-${val}`, {text: key, style: 'color: #0d6efd'}));
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: val}));
        } else if (key === 'pdt' || key === 'bdt' || key === 'dhl' || key === 'zdt') {
            tr.append(createElement('td', `td-key-${val.title}`, {text: val.title, style: 'color: #0d6efd'}));
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: formatDate(new Date(val.value), true).getFullSep}));
        } else if (key === 'DATI' || key === 'RE') {
            tr.append(createElement('td', `td-key-${key}`, {text: key === 'DATI' ? 'Date of send message' : key, style: 'color: #0d6efd'}));
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: val}));
        } else {
            tr.append(createElement('td', `td-key-${val.title}`, {text: val.title, style: 'color: #0d6efd'}));
            console.log('val', val)
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: val.stmCode === 'ob' || val.stmCode === 'kg' ? val.value.map(el => ` ${el.name} ${el.weight}`) : val.value}));
        }
        build.append(tr);
    }
    table.append(build);
}

export const insertOriginalMsg = (data) => {
    const table = findElement(`.table-archive-${data.msg._id}`);
    const build = createElement('tbody', `tbody-values-${data.msg._id}`);

    data.msg.originalMsg.RN = data.msg._id;
    for (let key in data.msg.originalMsg) {
        const val = data.msg.originalMsg[key];

        const tr = createElement('tr', '');

        if (key === 'TM' || key === 'MA' || key === 'RN') {
            tr.append(createElement('td', `td-key-${val}`, {text: key, style: 'color: #0d6efd'}));
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: val}));
        } else if (key === 'pdt' || key === 'bdt' || key === 'dhl' || key === 'zdt') {
            tr.append(createElement('td', `td-key-${val.title}`, {text: val.title, style: 'color: #0d6efd'}));
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: formatDate(new Date(val.value), true).getFullSep}));
        } else {
            tr.append(createElement('td', `td-key-${val.title}`, {text: val.title, style: 'color: #0d6efd'}));
            console.log('val', val)
            tr.append(createElement('td', `td-value-${data.index} text-end`,
                {text: val.stmCode === 'ob' || val.stmCode === 'kg' ? val.value.map(el => ` ${el.name} ${el.weight}`) : val.value}));
        }
        build.append(tr);

    }
    table.append(build);
}

export const insertRetMsg = (data) => {
    const insertDataField = findElement(`.insert-data-archive-${data.msg._id}`);
    let historyMsg = createElement('div', `ret-naf-archive-${data.msg._id} card-footer mt-3`);
    historyMsg.style.wordWrap = 'break-word';
    if (data.msg.archive_cancel) {
        const insertDataField = findElement(`.insert-data-archive-${data.msg._id}`);
        let historyMsg = createElement('div', `ret-naf-archive-${data.msg._id} card-footer mt-3`);
        historyMsg.style.wordWrap = 'break-word';
        historyMsg.textContent = data.msg.archive_cancel;
        insertDataField.append(historyMsg);
    }

    if (data.msg.archive_edit) {
        const insertDataField = findElement(`.insert-data-archive-${data.msg._id}`);
        let historyMsg = createElement('div', `ret-naf-archive-${data.msg._id} card-footer mt-3`);
        historyMsg.style.wordWrap = 'break-word';
        historyMsg.textContent = data.msg.archive_edit;
        insertDataField.append(historyMsg);
    }
    historyMsg.textContent = data.msg.archive;

    insertDataField.append(historyMsg);

    if (data.msg && data.msg.RET_NAF) {
        data.msg.RET_NAF.forEach((el, index) => {
            historyMsg = createElement('div', `ret-naf-${index} card-footer mt-3`);
            historyMsg.style.wordWrap = 'break-word';
            historyMsg.textContent = el;
            insertDataField.append(historyMsg);
        });
    }
}