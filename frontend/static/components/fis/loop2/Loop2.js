import AbstractView from "../../../views/AbstractView.js"
import {observer} from "../../../utils/observer/observer.js";
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {state} from "../../../utils/state/state.js";
import {useHttp} from "../../../utils/useHttp.js";
import {buildPageLoop2} from "./utils/builder.js";
import {toDate} from "../../submenu/utils/toDate.js";
import {formatDate} from "../../../utils/patternDateTime/formatDateTime.js";
import {calculateDU} from "../../utils/managmentTime/calculateDU.js";

const loop2 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop2 = async () => {

        const fisData = await useHttp(`${state.url}/api/fis/edit-operation`, 'POST', {id: localStorage.fis});

        if (!localStorage?.LOOP1) {
            localStorage.LOOP1 = JSON.stringify(await useHttp(`${state.url}/api/fis/loop1`));
        }

        buildPageLoop2(fisData);
        console.log(fisData);

        const btnLoop1 = findElement('.btn-loop1');
        const btnLoop3 = findElement('.btn-loop3');
        const btnLoop4 = findElement('.btn-loop4');
        const btnDelete = findElement('.btn-delete-loop2');
        const btnDeleteConfirm = findElement('.btn-delete-confirm-out');
        const send = findElement('.btn-ready-loop2');

        const prepareLoop = (loops) => {
            const loop = [];

            loops.forEach(el => {
                if (localStorage[`${el}`.toUpperCase()]) {
                    loop.push({type: `${el}`, value: JSON.parse(localStorage[`${el}`.toUpperCase()])});
                } else if (fisData && fisData[`${el}`]) {
                    loop.push({type: `${el}`, value: fisData[`${el}`]});
                } else {
                    // alert(`You need fill ${el}`);
                }
            });

            return loop;
        }

        send.onclick = () => {

            const loops = prepareLoop(['loop1', 'loop3', 'loop4']);

            if (loops.findIndex(el => el === 'loop3') < 0) {
                const loop3 = {
                    LT: fisData.start.LT.replace(/\+/, 'N'),
                    LG: fisData.start.LG.replace(/\+/, 'E'),
                    BD: formatDate(toDate(fisData.start, true), true).getDate,
                    BT: formatDate(toDate(fisData.start, true)).getTime,
                    XT: fisData.stop.LT.replace(/\+/, 'N'),
                    XG: fisData.stop.LG.replace(/\+/, 'E'),
                    FINISH: toDate(fisData.stop, true),
                    DU: calculateDU(toDate(fisData.start, true), toDate(fisData.stop, true)),
                }

                loops.push({type: 'loop3', value: loop3});
            }

            const finalMsg = {
                _id: localStorage.fis,
                loops,
            }
            useHttp(`${state.url}/api/fis`, 'PUT', {finalMsg});
            useHttp(`${state.url}/api/fis/loop1`, 'POST', {loop1: JSON.parse(localStorage.LOOP1)});

        }

        btnLoop1.onclick = () => localStorage.backpage = '/loop2';
        btnLoop3.onclick = () => localStorage.backpage = '/loop2';
        btnLoop4.onclick = () => localStorage.backpage = '/loop2';

        btnDelete.onclick = () => {

        }

        btnDeleteConfirm.onclick = () => {
            useHttp(`${state.url}/api/fis/${localStorage.fis}`, 'DELETE');
        }
    }

    observer(dc, logicLoop2);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop2');
    }

    getHtml = async () =>
        `
        <div class="card text-center mb-3">
            <div class="fis-operation-title card-header">
                LHM-2020.02.14-11.15 UTC
            </div>
            <div class="card-body insert-loop4-loop2">
                <a href="/loop4" class="btn-loop4 btn btn-primary" data-link>REDIGER</a>
            </div>       
        </div>
        
        <div class="card text-center mb-3">    
            <div class="card-body insert-loop3-loop2">
                <div class="d-flex ">
                    <div class="card-title-3 fw-bold me-1 text-uppercase">start:</div>
                    <div class="start-fis card-text-3"></div>
                </div>
                <div class="d-flex ">
                    <div class="card-title-4 fw-bold me-1 text-uppercase">stopp:</div>
                    <div class="stop-fis card-text-4 text-uppercase"></div>
                </div>
                <div class="d-flex ">
                    <div class="card-title-5 fw-bold me-1 text-uppercase">Varighet:</div>
                    <div class="du-fis card-text-5 text-uppercase"></div>
                </div>
                <a href="/loop3" class="btn-loop3 btn btn-primary" data-link>REDIGER</a>
            </div>       
        </div>
        
        <div class="card text-center mb-3">
            <div class="card-body insert-loop1-loop2" style="    line-height: 0px;">

                <a href="/loop1" class="btn-loop1 btn btn-primary" data-link>REDIGER</a>
            </div>       
        </div>
        
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Vil du slette fiskeoperasjon?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <a class="nav-link link-light text-uppercase btn btn-secondary" data-bs-dismiss="modal">Back</a>
                        <a class="nav-link link-success text-uppercase btn-delete-confirm-out btn btn-outline-success" 
                        data-bs-dismiss="modal" href="${localStorage.backpage}" data-link>Confirm</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="btn-group btn-group-lg d-flex justify-content-center mt-3" role="group"
                aria-label="Basic example">
            <a class="nav-link link-danger text-uppercase btn-cancel-out btn btn-outline-danger me-3" href="${localStorage.backpage}" data-link>Tilbake</a>            
            <a href="${localStorage.backpage}"
                class="nav-link link-dark btn-delete-loop2 text-uppercase btn btn-outline-dark me-3"                
                data-bs-toggle="modal" data-bs-target="#deleteModal" data-link
                >Slett
            </a>            
<!--            <a class="nav-link btn-ready-loop2 link-success text-uppercase btn-send-out btn btn-outline-success" href="/fis" data-link>Ready</a>-->
            <a href="/fis" class="nav-link btn-ready-loop2 link-success text-uppercase btn-send-out btn btn-outline-success" data-link>Ready</a>
        </div>
        ${loop2()}
    `
}