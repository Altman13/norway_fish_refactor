import {findElement} from './managmentDOM/controlElement.js';
import {checkRegexpInput} from './checkRegexpInput.js';
import {toDate} from '../submenu/utils/toDate.js';

const contentTemplate = (data) =>
    `
        ${data}
    `;

export const displaySelection = (id, type, ob, kg, ca) => {
    let component = document.getElementById(`fis-${type}-${id}`);
    let content = findElement(`.content-${type}-${id}`);
    const header = findElement(`.title-${type}-${id}`);
    const obCodes = ['ob', 'kg', 'ca'];
    const inputCodes = ['ls', 'tf', 'tt', 'go', 'me', 'gp', 'fo', 'in', 'se', 'le', 'ci', 'gn', 'lt', 'bm', 'lf','la','lo'];

    const bredde = findElement(`.input-bredde-dca-${id}`);
    const lendge = findElement(`.input-lendge-dca-${id}`);
    const pos = {};

    if (bredde?.getAttribute('code').match('LTG') || bredde?.getAttribute('code').match('XTG')|| bredde?.getAttribute('code').match('LAO')) {
        pos.bredde = bredde.value;
    }

    if (lendge?.getAttribute('code').match('LTG') || lendge?.getAttribute('code').match('XTG')|| lendge?.getAttribute('code').match('LAO')) {
        pos.lendge = lendge.value;
    }

    if (bredde?.value && lendge?.value) {
        setContent(content, `${pos.bredde} ${pos.lendge}`);
    }

    if (component && obCodes.find(code => code !== component.getAttribute('code'))) {
        if (component.getAttribute('code') === 'gp') {
            setContent(content, component.value);
        }

        const code = component.getAttribute('code');
        const dateCodes = ['pdt', 'bdt', 'zdt', 'dhl'];

        if (dateCodes.find(c => c === code || c.toUpperCase() === code)) {
            setContent(content, toDate(component.value));
        }

        component.onkeyup = () => {
            setContent(content, component.value);
            checkRegexpInput(component);
        };
    } else {
        component = document.getElementById(`${type}-${id}`);

        if (component) {
            const code = component.getAttribute('code');

            if (inputCodes.find(c => c === code || c.toUpperCase() === code)) {
                component.onkeyup = () => {
                    setContent(content, component.value);
                    checkRegexpInput(component);
                };
            }

            if (obCodes.find(c => c === code)) {
                if (ob?.length) {
                    prepareList(ob, header, content);
                    checkRegexpInput(component);
                }

                if (kg?.length) {
                    prepareList(kg, header, content);
                    checkRegexpInput(component);
                }

                if (ca?.length) {
                    prepareList(ca, header, content);
                    checkRegexpInput(component);
                }
            }

            if (code === 'lao' || code === 'xtg' || code ==="ltg") {
                const bredde = findElement(`.input-bredde-${type}-${id}`);
                const lendge = findElement(`.input-lendge-${type}-${id}`);
                    
              //  setContent(content, `${bredde.value} ${lendge.value}`);
            }
        }
    }
};

const setContent = (content, value) => {
    content.innerHTML = '';
    content.insertAdjacentHTML('beforeend', contentTemplate(value));
};

const prepareList = (list, header, content) => {
    console.log('list', list)
    if (list.length) {
        content.innerHTML = '';
        list.forEach(val => {
            content.insertAdjacentHTML('beforeend', `<div class=fish-on-board-${val.id}>`+contentTemplate(` ${val.name} ${val.weight}`+`</div>`));
        });
    }
};