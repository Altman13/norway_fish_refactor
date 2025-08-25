import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {templateAccordion} from "../../fis/utils/accordionManager/createAccordion.js";
import {templateButton} from "../../fis/utils/components/components.js";
import {printData} from "../../../utils/printData.js";
import {switcher} from "../../fis/utils/builder/loopBuilder.js";
import {addFishRecord} from "../../utils/registrationFish.js";
import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";

export const createBlockA = (id, list, key, data) => {
    const dcaList = list.find(code => code.type === key.toLowerCase());
    const getRecord = dcaList.data.find(type => String(type.code) === data);
    const name = key === 'QI' ? 'Velg type KVOTE' : key === 'AC' ? 'Velg AKTIVITET' : '';

    createRecordDca(id, name, getRecord, 'select');
    printData(`dca-${id}`, dcaList.data);
}

export const createBlockB = (id, list, key, data, index, result) => {
    const dcaInsert = findElement('.dca-operation');

    if (key === 'GP' || key === 'GS') {
        data = String(data);
    }

    const mapCodeToTemplate = [
        {code: 'ZO', type: 'select', title: 'Velg SONE'},
        {code: 'TF', type: 'input', title: 'KALLESIGNAL til fartoy det pumpes FRA'},
        {code: 'GE', type: 'select', title: 'Velt type REDSKAP'},
        {code: 'GS', type: 'select', title: 'Velt type TRAL'},
        {code: 'ME', type: 'input', title: 'Velt type MASKEVIDDE'},
        {code: 'GO', type: 'input', title: 'Angi spileavstand i RIST (mm)'},
        {code: 'GP', type: 'select', title: 'Var det Redskapsproblemer?'},
        {code: 'FO', type: 'input', title: 'Registrer antall TEINER / KROK'},
        {code: 'CA', type: 'register', title: 'Redigere fangst'},
        {code: 'IN', type: 'input', title: 'Individnummer'},
        {code: 'SE', type: 'input', title: 'Kjonn'},
        {code: 'LE', type: 'input', title: 'Lengde'},
        {code: 'CI', type: 'input', title: 'Omkrets'},
        {code: 'BM', type: 'multi', title: 'Spekkmal'},
        {code: 'GN', type: 'input', title: 'Granatnummer'},
        {code: 'LF', type: 'input', title: 'Foster'},
        {code: 'SS', type: 'select', title: 'Velg type SILD'},
        {code: 'LTG', type: 'pos', title: 'Fiskestart - Posisjon'},
        {code: 'BDT', type: 'date', title: 'Fiskestart - Dato og Tid'},
        {code: 'DATI', type: 'date', title: 'Fiskestopp - Dato og Tid'},
        {code: 'XTG', type: 'pos', title: 'Fiskestopp - Posisjon'},
        {code: 'DU', type: 'input', title: 'Varighet'},
    ];

    const getCode = mapCodeToTemplate.find(get => get.code === key);
    const dcaList = list.find(code => code.type === key.toLowerCase());
    const getRecord = dcaList?.data.find(type => String(type.code) === data);

    const createField = (value) => {
        const temp = {
            id,
            title: 'dca',
            code: getCode.code,
            value: String(value),
            blockB: index,
        }

        dcaInsert.insertAdjacentHTML('beforeend',
            templateAccordion({
                id, name: getCode.title, title: 'dca',
                component: switcher(getCode.type, temp) ? switcher(getCode.type, temp) : '',
                btn: templateButton({id, title: 'dca'}),
            }));

        const content = findElement(`.content-dca-${id}`);
        content.textContent = temp.value;

        if (getCode.code === 'CA') {
            result[`blockB${temp.blockB}`] = [];
            splitCaRecord(id, value, list, getCode, result);
        }

        if (getCode.code === 'LTG' || getCode.code === 'XTG') {
            splitPosRecord(id, value, getCode);
            content.textContent = value;
        }

        if (getCode.code === 'BDT') {
            const date = findElement(`.datetime-dca-${id}`);

            const year = value.slice(0, 4);
            const mon = value.slice(5, 7);
            const day = value.slice(8, 10);
            const hour = value.slice(11, 13);
            const min = value.slice(14, 16);
            console.log(new Date(year, +mon - 1, day, hour, min));

            date.setAttribute('value', new Date(year, +mon - 1, day, hour, min));
            content.textContent = value;
        }
    }

    if (getCode) {
        if (getRecord) {
            createField(getRecord.name);
            printData(`dca-${id}`, dcaList.data);
        } else {
            createField(data);
            if (key === 'CA') {
                printData(`dca-${id}`, list.find(code => code.type === 'fish').data);
            }
        }
    }
}

export const createRecordDca = (id, name, value, type, index) => {
    const dcaInsert = findElement('.dca-operation');
    const code = name === 'Velg type KVOTE' ? 'QI' : name === 'Velg AKTIVITET' ? 'AC' : '';
    const temp = {
        id,
        title: 'dca',
        code: code ? code : 'STOP',
        value: value ? value.name : '',
        blockB: index
    }

    dcaInsert.insertAdjacentHTML('beforeend',
        templateAccordion({
            id, name: name ? name : 'Fiskestopp - Dato og Tid', title: 'dca',
            component: switcher(type, temp) ? switcher(type, temp) : '',
            btn: templateButton({id, title: 'dca'}),
        }));

    const content = findElement(`.content-dca-${id}`);
    content.textContent = temp.value;
}

const splitPosRecord = (id, value) => {
    const bredde = findElement(`.input-bredde-dca-${id}`);
    const lendge = findElement(`.input-lendge-dca-${id}`);

    bredde.value = value.split(' ')[0];
    bredde.setAttribute('value', value.split(' ')[0]);
    lendge.value = value.split(' ')[1];
    lendge.setAttribute('value', value.split(' ')[1]);
};

const splitCaRecord = (id, record, list, getCode, result) => {
    const content = findElement(`.content-dca-${id}`);
    content.textContent = '';
    let splitRecArr;

    if (Array.isArray(record)) {
        splitRecArr = record.join('').match(/\w+\s?\w+?\s?\d+/gm);
    } else {
        splitRecArr = record.match(/\w+\s?\w+?\s?\d+/gm);
    }

    const temp = JSON.parse(JSON.stringify(getCode));
    temp.id = id;

    const lastBlock = Object.keys(result)[Object.keys(result).length - 1];

    splitRecArr.forEach(el => {
        const codeName = el.replace(/\d+/, '').trim();
        const getFish = list.find(get => get.type === 'fish');
        temp.code = getFish.data.find(get => get.code === codeName || get.name === codeName).code;
        temp.name = getFish.data.find(get => get.code === codeName || get.name === codeName).name;
        temp.weight = el.replace(/\w+\s/g, '').trim();
        result[lastBlock].push({code: temp.code, name: temp.name, weight: temp.weight});
        content.textContent += `${temp.name} ${temp.weight} `;
        addFishRecord(id, temp, 'dca');
    });
}