import {createElement, findElement} from './managmentDOM/controlElement.js';
import {templateTable} from '../../utils/templates/templateTable.js';
import {appendWeight} from '../../utils/processingData/appendWeight.js';
import {getCode} from '../../utils/processingData/getCode.js';
import {printData} from '../../utils/printData.js';

const updateInput = (uuid, id, weight, type) => {
    let input = findElement(`.${type}-weight-${uuid}-${id}`);
    const sum = +input.value + +weight.value;
    input.value = sum;
    input.setAttribute('value', sum);
};

const updateKg = (id, title, list) => {
    console.log(title+'-'+id)
    // document.getElementById(`datalistOptions-${title}-${id}`)
    //     .innerHTML = '';
   // printData(`${title}-${id}`, list);

    const fishName = findElement(`.datalist-${title}-${id}`);
    const fishWeight = findElement(`.input-text-${title}-${id}`);

    fishName.onchange = () => {
        const getFish = list.find(el => el.name === fishName.value);
        fishWeight.value = getFish.weight;
    };
};

export const regFishLogic = (id, title, fishList, obData, obList, kgList) => {
    const fishName = findElement(`.datalist-${title}-${id}`);
    const fishWeight = findElement(`.input-text-${title}-${id}`);

    if (fishName.value && fishWeight.value > 0) {
        console.log('RegFishLogic is ok');
        const prepareData = {
            id,
            type: title,
            fishList: fishList.fish ? fishList.fish : fishList,
            fishName: fishName,
            fishWeight: fishWeight,
            obList: obData ? obData.fish : [],
            result: kgList ? kgList : obList,
        };

        registrationFish(prepareData);
        if (kgList || title === 'dca') {
            id -= 1;
        }
        updateKg(id, title, obList);
    }
    console.log(obList);
};

export const addFishRecord = (id, list, type) => {
    const table = findElement(`.tableHere-${id}`);
    table.innerHTML += templateTable({
        uuid: id,
        id: list.id,
        type,
        code: `${list.code}-${id}`,
        name: list.name,
        weight: list.weight
    });
};

export const updaterWeightFish = (id, type, list, elem) => {
    const fishname = findElement(`.fishname-${type}-${id}`);
    const element = findElement(`.${elem.classList[0]}`);
    console.log(list);
    const ob = list.find(get => get.name === fishname.textContent.trim());
    const setWeight = (value) => {
        element.value = value;
        ob.weight = value;
        element.setAttribute('value', element.value);
    };
    element.onkeyup = () => {
        if (+element.value > 0) {
            setWeight(element.value);
        } else {
            setWeight(1);
        }
    };
};

// need refactoring MANY redundant actions
export const registrationFish = (props) => {
    const fishList = props.fishList;
    const fishName = props.fishName;
    const fishWeight = props.fishWeight;
    const obList = props.obList ? props.obList : [];
    const resultOb = getCode(fishList, fishName, fishWeight);

    if (findElement(`.${resultOb.code}-${props.id}`)) {
        updateInput(props.id, resultOb.id, fishWeight, props.type);
    } else {
        addFishRecord(props.id, resultOb, props.type);
    }

    appendWeight(obList, resultOb);

    obList.forEach((el, index) => {
        const elem = createElement(
            'span',
            `text-${props.title}-${index} text-center`,
            {text: `${el.name} ${el.weight}`});
        elem.style = 'color: #0d6efd';
    });

    fishWeight.value = '';
    fishName.value = '';

    const index = props.result.findIndex(el => el.code === obList[0].code);

    if (index >= 0)
        props.result[index].weight += obList[0].weight;
    else
        props.result.push(obList[0]);
};