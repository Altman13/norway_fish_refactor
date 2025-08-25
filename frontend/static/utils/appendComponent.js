const appendComponent = (className, component) => {
    document.querySelector(className).innerHTML = component;
}

export default appendComponent;