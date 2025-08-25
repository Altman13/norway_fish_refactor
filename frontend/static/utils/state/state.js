const URL = '192.168.100.1';

export const state = {
    url: `http://${URL}:8000`,
    ws: `${URL}:9000`,
    LOGIN: localStorage.AUTH ? JSON.parse(localStorage.AUTH).login : undefined
};
