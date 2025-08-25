export const formatDate = (date, plusOne) => {
    const appendZero = (value) => value < 10 ? `0${value}` : value;

    let YEAR, MONTH, DAY, hour12, minute, SEC, HOUR, MIN, getDate, getTime, getFull, getFullSep;

    const num = plusOne ? 1 : 0;

    YEAR = date.getFullYear(),
        MONTH = appendZero(+date.getMonth() + num), // months are zero indexed
        DAY = appendZero(date.getDate()),
        hour12 = appendZero(date.getHours()),
        minute = appendZero(date.getMinutes()),
        SEC = appendZero(date.getSeconds()),
        HOUR = appendZero(hour12 % 24), // hour returned in 24 hour format
        MIN = minute;

    getDate = `${YEAR} ${MONTH} ${DAY}`;
    getTime = `${HOUR} ${MIN}`;
    getFull = `${YEAR} ${MONTH} ${DAY} ${HOUR} ${MIN}`;
    getFullSep = `${YEAR}-${MONTH}-${DAY} ${HOUR}:${MIN}`;

    return {YEAR, MONTH, DAY, HOUR, MIN, SEC, getFull, getFullSep, getDate, getTime}
}
