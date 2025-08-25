import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";

export const toDate = (date, todate) => {
    if (todate) {
        return new Date(date.YEAR, +date.MONTH - 1, date.DAY, date.HOUR, date.MIN);
    }
    if (typeof date === 'object') {
        return formatDate(new Date(date.YEAR, +date.MONTH - 1, date.DAY, date.HOUR, date.MIN), true).getFullSep;
    } else {
        const year = date.slice(0, 4);
        const mon = date.slice(5, 7);
        const day = date.slice(8, 10);
        const hour = date.slice(11, 13);
        const min = date.slice(14, 16);
        return formatDate(new Date(year, +mon - 1, day, hour, min), true).getFullSep;
    }
}
