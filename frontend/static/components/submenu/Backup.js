import AbstractView from "../../views/AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Backup');
    }

    getHtml = async () =>
        `
        Backup
    `
}