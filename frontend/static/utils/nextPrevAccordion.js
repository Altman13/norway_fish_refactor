export const nextPrevAccordion = (id, symbol, type) => {
    const contentCurrent = document.getElementById(`accordion-id-${id}`);
    const accordionCurrent = document.querySelector(`.accordion-button-id-${id}-${type}`);

    switch (symbol) {
        case '+':
            contentCurrent.className = 'accordion-collapse collapse';
            const contentNext = document.getElementById(`accordion-id-${id + 1}`);
            contentNext.className = 'accordion-collapse collapse show';

            accordionCurrent.className += ' collapsed';
            accordionCurrent.setAttribute('aria-expanded', 'false');

            const accordionNext = document.querySelector(`.accordion-button-id-${id + 1}-${type}`);
            accordionNext.className = accordionNext.className.replace(/collapsed/, '');
            accordionNext.setAttribute('aria-expanded', 'true');
            break;
        case '-':
            contentCurrent.className = 'accordion-collapse collapse';
            const contentPrev = document.getElementById(`accordion-id-${id - 1}`);
            contentPrev.className = 'accordion-collapse collapse show';

            accordionCurrent.className += ' collapsed';
            accordionCurrent.setAttribute('aria-expanded', 'false');

            const accordionPrev = document.querySelector(`.accordion-button-id-${id - 1}-${type}`);
            accordionPrev.className = accordionPrev.className.replace(/collapsed/, '');
            accordionPrev.setAttribute('aria-expanded', 'true');
            break;
    }
};