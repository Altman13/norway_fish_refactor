import {createElement} from '../components/utils/managmentDOM/controlElement.js';

export const printData = (id, data, type) => {
    let dataList;

    if (type) {
        dataList = document.getElementById(`datalistOptions-${type}-${id}`);
    } else {
        dataList = document.getElementById(`datalistOptions-${id}`);
    }

    if (dataList) {
        data.forEach(item => {
            dataList.append(createElement('option',
                `${item.name}`,
                {
                    text: item.name.trim(),
                    optionValue: item.name.trim(),
                }));
        });
    }
};