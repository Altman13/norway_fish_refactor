import {insertOperation} from '../../components/fis/utils/insertOperation.js';

export const rebuildFis = async (data) => {
    await insertOperation(data);
};