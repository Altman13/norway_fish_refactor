import AbstractView from "../../views/AbstractView.js";
import {observer} from "../../utils/observer/observer.js";
import {useHttp} from "../../utils/useHttp.js";
import {state} from "../../utils/state/state.js";
import {
    insertCancelMsg,
    insertOriginalDcaEditMsg,
    insertOriginalDcaMsg,
    insertOriginalMsg,
    insertRetMsg
} from "./utils/buildArchiveMsg.js";
import {templateArchive} from "./utils/templateArchive.js";

let archives = new Array();

const createArchivePage = (data, dc) => {
    const validTypes = ['DEP', 'POR', 'DCA', 'TRA', 'COE', 'COX', 'SONE'];
    data.forEach((msg, index) => {
        if (validTypes.find(code => code === msg.type)) {
            dc.innerHTML += templateArchive({
                id: msg._id,
                title: msg.stm32.TM,
                date: msg.stm32.DATI,
                ret: msg.RET ? msg.RET[msg.RET.length - 1] : '',
            });

            if (msg.type === 'DCA') {
                if (msg.stm32_edit) {
                    insertOriginalDcaEditMsg(msg)
                        .then(() => {});
                } else {
                    insertOriginalDcaMsg(msg)
                        .then(() => {});
                }
            } else {
                if (msg.stm32_cancel && msg.type !== 'DCA') {
                    insertCancelMsg({msg, index});
                } else {
                    insertOriginalMsg({msg, index});
                }
            }
            insertRetMsg({msg});
        }
    });
}

const archive = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicArchive = async () => {
        createArchivePage(archives, dc);
    }

    observer(dc, logicArchive);
    return '';
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Archive');
    }

    getData = async () => {
        archives = await useHttp(`${state.url}/api/archive`);
        archives.reverse()
        return '';
    }

    getHtml = async () =>
        `
        ${await this.getData()}
        ${archive()}
    `
}