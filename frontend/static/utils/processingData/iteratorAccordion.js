import {findElement} from "../../components/utils/managmentDOM/controlElement.js";
import {nextPrevAccordion} from "../nextPrevAccordion.js";

let next, cancel;

export const iteratorAccordion = (count, name, start, type) => {
    if (start) {
        for (let i = start; i < count; i++) {
            next = findElement(`.btn-send-${name}-id-${i}`);
            cancel = findElement(`.btn-cancel-${name}-id-${i}`);

            if (i === 0) {
                cancel.style.visibility = 'hidden';
                next.onclick = () => nextPrevAccordion(i, '+');
            } else if (i === (count - 1)) {
                cancel.onclick = () => nextPrevAccordion(i, '-');
                next.onclick = () => document.getElementById(`accordion-id-${i}`).className = 'accordion-collapse collapse';
            } else {
                cancel.onclick = () => nextPrevAccordion(i, '-');
                next.onclick = () => nextPrevAccordion(i, '+');
            }
        }
    }
    if (name) {
        for (let i = 0; i < count; i++) {
            next = findElement(`.btn-send-${name}-id-${i}`);
            cancel = findElement(`.btn-cancel-${name}-id-${i}`);

            if (i === 0) {
                cancel.style.visibility = 'hidden';
                next.onclick = () => nextPrevAccordion(i, '+', type);
            } else if (i === (count - 1)) {
                cancel.onclick = () => nextPrevAccordion(i, '-', type);
                next.onclick = () => document.getElementById(`accordion-id-${i}`).className = 'accordion-collapse collapse';
            } else {
                cancel.onclick = () => nextPrevAccordion(i, '-', type);
                next.onclick = () => nextPrevAccordion(i, '+', type);
            }
        }
    } else {
        for (let i = 0; i < count; i++) {
            next = findElement(`.btn-send-id-${i}`);
            cancel = findElement(`.btn-cancel-id-${i}`);

            if (i === 0) {
                cancel.style.visibility = 'hidden';
                next.onclick = () => nextPrevAccordion(i, '+', type);
            } else if (i === (count - 1)) {
                cancel.onclick = () => nextPrevAccordion(i, '-', type);
                next.onclick = () => {
                    document.getElementById(`accordion-id-${i}`).className = 'accordion-collapse collapse';
                }
            } else {
                cancel.onclick = () => nextPrevAccordion(i, '-', type);
                next.onclick = () => nextPrevAccordion(i, '+', type);
            }
        }
    }
}