import { state } from '../state/state.js';
import { findElement } from '../../components/utils/managmentDOM/controlElement.js';
import { templateModal } from '../../utils/templates/TemplateModal.js';
import { useHttp } from '../../utils/useHttp.js';

const socket = new WebSocket(`ws://${state.ws}`);

socket.onmessage = (event) => {
    console.log(`Receive data: ${event.data}`);
    if (event.data === 'Update system') {
        const dc = document.querySelector('.dynamic-content');
        dc.insertAdjacentHTML('beforeend', templateModal());
        findElement('.updater-modal')
            .click();
        findElement('.updater-title').textContent = event.data;
    } else if (event.data === 'Done') {
        const closer = findElement('.updater-close');
        if (closer) {
            closer.click();
        }
    } else if (event.data === 'Reload application') {
        findElement('.updater-title').textContent = event.data;
        useHttp(`${state.url}/api/main/pid`)
            .then(pid => {
                if (pid) {
                    console.log(pid);
                    socket.send(JSON.stringify({ text: 'reload', pid }));
                }
            });
    } else {
        findElement('.updater-title').textContent = event.data;
    }
};
