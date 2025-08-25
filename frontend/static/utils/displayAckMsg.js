import {createElement, findElement} from '../components/utils/managmentDOM/controlElement.js';

export const displayAckMsg = (id, type, msg) => {
    const table = findElement(`.table-${type.toLowerCase()}-cancel-${id}`);
    const build = createElement('tbody', `tbody-values-${id}`);

    const keys = ['ob', 'kg', 'ca'];

    for (const key in msg) {
        if (keys.find(code => code === msg[key].stmCode)) {
            for (const k in msg[key].value) {
                const data = msg[key].value[k];
                console.log('data.name', data.name)
                console.log('data.weight', data.weight)
                msg[key][k] = `${data.name} ${data.weight}`;
            }
        }
        const tr = createElement('tr', '');
        tr.append(createElement('td', `td-key-${id}`, {text: msg[key].title, style: 'color: #0d6efd'}));
        tr.append(createElement('td', `td-value-${id} text-end`, {text: msg[key].value}));
        build.append(tr);
    }
    table.append(build);
};
