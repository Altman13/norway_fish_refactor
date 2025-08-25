import {findElement} from "../../components/utils/managmentDOM/controlElement.js";

export const getValue = (className) => findElement(className).value;