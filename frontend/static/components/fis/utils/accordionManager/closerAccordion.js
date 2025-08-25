import {findElement} from "../../../utils/managmentDOM/controlElement.js";

export const closerAccordion = (cur, prev, next) => {
    const p = document.getElementById(prev);
    const c = document.getElementById(cur);
    const n = document.getElementById(next);

    if (p && prev) {
        const id = cur.charAt(cur.length - 1);
        setId(prev);
        if (id > 2) {
            findElement(`.accordion-child-loop1-${id}`)
                .remove();
        }
    }

    if (c && cur) {
        setId(cur);
    }

    if (n && next) {
        setId(next);
    } else {
        // console.log('cur', cur)
        // findElement(`.accordion-child-loop1-${id}`).remove();
        // setId(cur);
    }
}

const setId = (id) => {
    new bootstrap.Collapse(document.getElementById(id), {
        toggle: true
    });
}