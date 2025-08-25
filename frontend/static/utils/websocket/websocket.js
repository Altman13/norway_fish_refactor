import {state} from '../state/state.js';

export const websocket = (sendMsg, pid) => {
    const socket = new WebSocket(`ws://${state.ws}`);

    socket.onopen = () => {
        console.log('Соединение установлено.');
        socket.send();
    };
    socket.onmessage = (event) => {
        console.log('Получены данные ' + event.data);
    };

    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения');
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };
}