import { observer } from '../../utils/observer/observer.js';
import { state } from '../../utils/state/state.js';
import AbstractView from '../../views/AbstractView.js';

const firmware = () => {
    const dc = document.querySelector('.dynamic-content');

    const logicFirmware = () => {
        // useHttp(`${state.url}/api/firmware/`, 'POST', {file: 'te'})
        //     .then(data => console.log(data));
    };

    observer(dc, logicFirmware);
    return '';
};

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Firmware');
    }

    getHtml = async () =>
    `
        <div class="my-3 mx-3">
            <form action="${state.url}/api/firmware/" method="post" enctype="multipart/form-data">
                <label for="formFile" class="form-label">Choose a file of firmware</label>
                <input class="form-control" name="firmwarefile" type="file" id="formFile">
                <input type="submit" value="load" class="btn btn-success mt-3 text-uppercase" />
            </form>
            <div class="text-center">Ver. 1.0.0</div>
        </div>
        ${firmware()}
    `;

}