const createElement = (tagName, className, properties = {}) => {

    const element = document.createElement(tagName);
    element.setAttribute('class', className);
    if (properties !== null &&
        properties.className !== null  &&
        properties.className !== typeof undefined &&
        properties !== typeof undefined &&
        properties !== '') {

        element.textContent = properties.text;

        if (properties.style) {
            element.style = properties.style;
        }

        if (properties.textHTML) {
            element.insertAdjacentHTML('afterbegin', properties.textHTML);
        }

        if (properties.optionValue) {
            element.setAttribute('value', properties.optionValue);
        }
    }

    return element;

};

const findElement = (className) => {

    if (className !== '' &&
        className !== typeof undefined &&
        className !== null) {
        return document.querySelector(className);
    }

};

export { createElement, findElement };