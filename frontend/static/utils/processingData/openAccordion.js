export const openAccordion = (current, next, type) => {
    // document.getElementById(`accordion-id-${current}`).className = 'accordion-collapse collapse';
    // document.getElementById(`accordion-id-${next}`).className = 'accordion-collapse collapse show';
    const contentCurrent = document.getElementById(`accordion-id-${current}`);

    contentCurrent.className = 'accordion-collapse collapse';

    if (next) {
        const contentNext = document.getElementById(`accordion-id-${next}`);
        contentNext.className = 'accordion-collapse collapse show';
        const accordionNext = document.querySelector(`.accordion-button-id-${next}-${type}`);
        accordionNext.className = accordionNext.className.replace(/collapsed/, '');
        accordionNext.setAttribute('aria-expanded', "true");
        const accordionCurrent = document.querySelector(`.accordion-button-id-${next}-${type}`);
        accordionCurrent.className += ' collapsed';
        accordionCurrent.setAttribute('aria-expanded', "false");
    }
}