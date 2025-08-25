import AbstractView from "../../views/AbstractView.js";
import {template} from "../utils/templates/templateAccordion.js";
import {temp} from "../utils/templates/templateData.js";
import {observer} from "../../utils/observer/observer.js";
import {createElement, findElement} from "../utils/managmentDOM/controlElement.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";
import {uCreateNewBlock} from "../fis/utils/builder/loopBuilder.js";

let favData;

const createListElement = (data) => {
    const template = findElement('.list-group-fav-0');
    const count = template.childElementCount;
    template.append(createElement('li',
        `list-group-item-template-id-${count} list-group-item list-group-item-success text-uppercase mb-3`,
        {
            text: `${data.navn.trim()} ${data.bredde} ${data.lengde}`
        }));
}

const printData = (data) => {
    const template = findElement('.list-group-fav-0');

    template.innerHTML = '';

    data.forEach(el => {
        createListElement(el);
    });
}

const fav = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicFav = () => {

        const names = [
            {type: 'favom', value: 'FISKEOMRADE'},
            {type: 'favmot', value: 'FISKE MOTTAK'},
            // {type: '', value: 'Mal (templates)'},
            // {type: '', value: 'AUTO DCA'}
        ];
        uCreateNewBlock(dc, 'fav', names);

        console.log(favData)

        if (favData) {
            printData(favData);
        }

        const navnField = findElement('.navn-fav-0');
        const breddeField = findElement('.bredde-fav-0');
        const lengdeField = findElement('.lengde-fav-0');
        const saveBtn = findElement('.btn-send-fav-0');

        saveBtn.onclick = () => {
            if (navnField.value && breddeField.value && lengdeField.value) {
                const favorite = {
                    navn: navnField.value,
                    bredde: breddeField.value,
                    lengde: lengdeField.value,
                }

                useHttp(`${state.url}/api/fav/`, 'POST', favorite)
                    .then(data => {
                        createListElement(data);
                    });
            }
        }

    }

    observer(dc, logicFav);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Favorite');
    }

    getData = async () => {
        favData = await useHttp(`${state.url}/api/fav`);
        return '';
    }

    templateMal = async (data) =>
    `
    
    `
    templateAutoDca = async (data) =>
    `
    
    `

    getHtml = async () =>
    `
        ${await this.getData()}    
        ${fav()}   
    `
}