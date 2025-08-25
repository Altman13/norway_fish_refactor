import {templateAccordion, templateContainerAccordion} from "../accordionManager/createAccordion.js";
import {findElement} from "../../../utils/managmentDOM/controlElement.js";
import {
    templateButton,
    templateDate,
    templateDca,
    templateDepPositionTemp,
    templateFavFiskemottak,
    templateFavFiskeomrade,
    templateInput,
    templateInputLoop3,
    templateMultiInput,
    templatePosition,
    templatePositionTemp,
    templateRegister,
    templateSelect
} from "../components/components.js";

export const switcher = (type, temp) => {
    let component;

    switch (type) {
        case 'input': component = templateInput(temp); break;
        case 'input3': component = templateInputLoop3(temp); break;
        case 'select': component = templateSelect(temp); break;
        case 'pos': component = templatePosition(temp); break;
        case 'tpos': component = templatePositionTemp(temp); break;
        case 'tposDep': component = templateDepPositionTemp(temp); break;
        case 'date': component = templateDate(temp); break;
        case 'register': component = templateRegister(temp); break;
        case 'multi': component = templateMultiInput(temp); break;
        case 'favom': component = templateFavFiskeomrade(temp); break;
        case 'favmot': component = templateFavFiskemottak(temp); break;
        case 'dca': component = templateDca(temp); break;
    }

    return component;
}

export const loopBuilder = (dc, loop, type, names, codes) => {
    dc.insertAdjacentHTML('beforeend', templateContainerAccordion({id: 0, title: loop}));

    const acc = findElement(`.accordion-${loop}-0`);

    names.forEach((el, index) => {
        const temp = {
            id: index,
            title: loop,
            code: codes[index]
        }
        acc.insertAdjacentHTML('beforeend', templateAccordion({
            id: index, name: el, title: loop,
            component: switcher(type, temp) ? switcher(type, temp) : '',
            btn: templateButton({id: index, title: loop,}),
        }));
    });
}

export const uCreateNewBlock = (dc, loop, names, code) => {
    dc.insertAdjacentHTML('beforeend', templateContainerAccordion({id: 0, title: loop}));
    const acc = findElement(`.accordion-${loop}-0`);

    names.forEach((el, index) => {
        const id = acc.childElementCount;
        const temp = {
            id,
            title: loop,
            code: code ? Array.isArray(code) ? code[index] : code : null,
        }
        acc.insertAdjacentHTML('beforeend', templateAccordion({
            id, name: el.value, title: loop,
            component: switcher(el.type, temp) ? switcher(el.type, temp) : '',
            btn: templateButton({id, title: loop,}),
        }));
    });
}

export const createNewBlock = (loop, name, code, type) => {
    const acc = findElement(`.accordion-${loop}-0`);
    const id = acc.childElementCount;
    const temp = {
        id,
        title: loop,
        code
    }

    acc.insertAdjacentHTML('beforeend', templateAccordion({
        id,
        name,
        title: loop,
        component: switcher(type, temp) ? switcher(type, temp) : '',
        btn: templateButton({id, title: loop,}),
    }))
}