const observer = (DOMElement, func) => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            func();
        });
        observer.disconnect();
    });

    const config = {
        attributes: true,
        childList: true,
        characterData: true
    };

    observer.observe(DOMElement, config);
}

export {observer}


