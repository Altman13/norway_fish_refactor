import {findElement} from '../../utils/managmentDOM/controlElement.js';
import {setInactivaOperation} from './setInactiveOperation.js';

export const changeStatusFisOperation = (data) => {
    findElement(`.card-title-${data._id}`)
        .setAttribute('class' , `card-title-${data._id} card text-dark bg-success`);
    setInactivaOperation(data);
};