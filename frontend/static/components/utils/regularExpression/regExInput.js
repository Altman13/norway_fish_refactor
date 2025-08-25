export const regExpTest = (regExpPattern, value, element, e) => {
    if (regExpPattern instanceof RegExp) {
        const text = e.target.value;
        const rExp = new RegExp(regExpPattern);

        if (e.key === 'Backspace') {
            value = value.slice(value.length, 1);
            element.setAttribute('value', value);
        }

        if (value.length) {
            value = rExp.test(text[value.length]) ? text : value;
            element.setAttribute('value', rExp.test(text[value.length]) ? text : value);
        } else {
            value = rExp.test(text) ? text : value;
            element.setAttribute('value', rExp.test(text) ? text : value);
        }

        return element.value = value;
    } else {
        throw `RegEx is not valid: ${regExpPattern}`;
    }
};