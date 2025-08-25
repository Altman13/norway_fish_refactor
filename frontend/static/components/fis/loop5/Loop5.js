import AbstractView from "../../../views/AbstractView.js"
import {findElement} from "../../utils/managmentDOM/controlElement.js";
import {observer} from "../../../utils/observer/observer.js";

const loop5 = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicLoop5 = () => {
        findElement('.ready-loop5')
            .onclick = () => {
            const dca = localStorage.DCA_EDIT ? JSON.parse(localStorage.DCA_EDIT) : undefined;
            if (dca.isEdit) {
                dca.isEdit = false;
            }
        }
    }

    observer(dc, logicLoop5);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Loop5');
    }

    getHtml = async () =>
        `
        <div class="card text-center mb-3">
            <div class="card-header">
                LHM-2020.02.14-11.15 UTC
            </div>
            <div class="card-body">
                <div class="d-flex ">
                    <p class="card-title-1 fw-bold me-1">Redskapsproblemer:</p>
                    <p class="card-text-1">Ingen Problemer</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-2 fw-bold me-1 text-uppercase">Fangst:</p>
                    <p class="card-text-2 text-uppercase">torsk 0</p>
                </div>
                <a href="/loop4" class="btn btn-primary">REDIGER</a>
            </div>       
        </div>
        
        <div class="card text-center mb-3">    
            <div class="card-body">
                <div class="d-flex ">
                    <p class="card-title-3 fw-bold me-1 text-uppercase">start:</p>
                    <p class="card-text-3">N59.106933 E10.41787 2020.02.15-11.15</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-4 fw-bold me-1 text-uppercase">stopp:</p>
                    <p class="card-text-4 text-uppercase">N59.106933 E10.41787 2020.02.15-11.15</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-5 fw-bold me-1 text-uppercase">Varighet:</p>
                    <p class="card-text-5 text-uppercase">120</p>
                </div>
                <a href="/loop3" class="btn btn-primary">REDIGER</a>
            </div>       
        </div>
        
        <div class="card text-center mb-3">
            <div class="card-body">
                <div class="d-flex ">
                    <p class="card-title-6 fw-bold me-1 text-uppercase">Aktivitet:</p>
                    <p class="card-text-6">fiske</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-7 fw-bold me-1 text-uppercase">sone:</p>
                    <p class="card-text-7 text-uppercase">Norge</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-8 fw-bold me-1 text-uppercase">Kvote:</p>
                    <p class="card-text-8 text-uppercase">ordinaer kvote</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-9 fw-bold me-1 text-uppercase">type redskap:</p>
                    <p class="card-text-9 text-uppercase">snurva</p>
                </div>
                <div class="d-flex ">
                    <p class="card-title-9 fw-bold me-1 text-uppercase">maskevidde:</p>
                    <p class="card-text-9 text-uppercase">130mm</p>
                </div>
                <a href="/loop1" class="btn btn-primary">REDIGER</a>
            </div>       
        </div>
        
        <div class="btn-group btn-group-lg d-flex justify-content-center mt-3" role="group"
                aria-label="Basic example">
            <a class="nav-link link-danger text-uppercase btn btn-outline-danger me-3" href="/" data-link>Tilbake</a>            
            <a class="nav-link link-dark text-uppercase btn btn-outline-dark me-3" href="/" data-link>Slett</a>            
            <a class="nav-link ready-loop5 link-success text-uppercase btn btn-outline-success" >Ready</a>
        </div>
        
        ${loop5()}
    `
}