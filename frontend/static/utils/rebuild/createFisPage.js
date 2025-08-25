import {insertOperation} from '../../components/fis/utils/insertOperation.js';
import {templateMainBtn} from '../../components/fis/utils/templatesFis.js';
import {setInactivaOperation} from '../../components/fis/utils/setInactiveOperation.js';

export const uCreateFisPage = (dc, data) => {
    data.sort((a, b) => {
        if (a.createdAt < b.createdAt)
            return -1;
        if (a.createdAt > b.createdAt)
            return 1;
        else return 0;
    });

    data.forEach(msg => {
        console.log(msg);
        insertOperation(msg);
        if (msg.status === 'INACTIVE' || msg.status === 'READY') {
            setInactivaOperation(msg);
        }
    });
};

export const createFisPage = (dc, data, where) => {
    uCreateFisPage(dc, data);
    if (where) {
        dc.insertAdjacentHTML(where, templateMainBtn());
    }
};