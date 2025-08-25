import { findElement } from '../components/utils/managmentDOM/controlElement.js';
import { observer } from '../utils/observer/observer.js';
import { state } from '../utils/state/state.js';
import { switcherStatus } from '../utils/status/switcherStatus.js';
import { useHttp } from '../utils/useHttp.js';
import AbstractView from './AbstractView.js';

const main = () => {
    const dc = document.querySelector('.dynamic-content');

    const mainLogic = () => {
        useHttp(`${state.url}/api/main/`)
            .then(data => {
                //console.log(data)
                const lastRecord = data;

                if (lastRecord && lastRecord.type !== 'FIS') {
                    switcherStatus(lastRecord, true);
                }
            });

        useHttp(`${state.url}/api/main/check-fis`)
            .then(data => {
                //console.log(data);
                if (data === 'ACTIVE') {
                    findElement('.fis-main')
                        .setAttribute('src', '/static/icons/Fish.svg');
                } else if (data === 'INACTIVE') {
                    findElement('.fis-main')
                    .setAttribute('src', '/static/icons/Warning.svg');
                } else if (data === 'READY') {
                    findElement('.fis-main')
                        .setAttribute('src', '/static/icons/OK.svg');
                } else {
                    findElement('.fis-main')
                        .setAttribute('src', '/static/icons/Grey.svg');
                }
            });
    };

    observer(dc, mainLogic);
    return '';
};

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Main');
    }

    async getHtml() {
        return `
        ${main()}
            <div class="d-flex flex-column gap-2">
                
                <div class="d-flex align-items-center gap-2">
                    <img src="/static/icons/IDLE Status.png" height="40" width="40" class="dep-main ms-3 flex-grow-0" alt="">
                        <a href="/dep" class="link-dark btn btn-outline-primary text-center flex-grow-1 text-uppercase text-decoration-none" data-link>DEP</a>
                </div>
               
                <div class="d-flex flex-column p-3 mb-2 bg-dark text-white">

                    <div class="d-flex align-items-center mb-3  gap-2">
                        <img src="/static/icons/IDLE Status.png" height="40" width="40" class="fis-main flex-grow-0" alt="">                    
                            <a href="/fis" class="link-dark btn bg-warning text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Fiske operasjon</a>
                    </div>

                    <div class="d-flex align-items-center mb-3  gap-2">
                        <img src="/static/icons/IDLE Status.png" height="40" width="40" class="dca-main flex-grow-0" alt="">
                            <a href="/dca" class="link-dark btn bg-warning text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Dca</a>
                    </div>



                </div>
                <div class="d-flex align-items-center gap-2">
                <img src="/static/icons/IDLE Status.png" height="40" width="40" class="por-main ms-3 flex-grow-0" alt="">
                    <a href="/por" class="link-dark btn btn-outline-primary text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Por</a>
            </div>

                <div class="d-flex align-items-center gap-2">
                <img src="/static/icons/IDLE Status.png" height="40" width="40" class="coe-main ms-3 flex-grow-0" alt="">
                    <a href="/coe" class="link-dark btn btn-outline-primary text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Coe</a>
                </div>
                <div class="d-flex align-items-center gap-2">
                <img src="/static/icons/IDLE Status.png" height="40" width="40" class="cox-main ms-3 flex-grow-0" alt="">
                    <a href="/cox" class="link-dark btn btn-outline-primary text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Cox</a>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                <img src="/static/icons/IDLE Status.png" height="40" width="40" class="tra-main ms-3 flex-grow-0" alt="">
                    <a href="/tra" class="link-dark btn btn-outline-primary text-center flex-grow-1 text-uppercase text-decoration-none" data-link>Tra</a>
                </div>

            </div>
        `;
    }

}