export const toNaf = (ret) => {
    if ('DATI' in ret) {
        ret.DA = ret.DATI.slice(0, 10).replace(/\s/g, '');
        ret.TI = ret.DATI.slice(11, ret.DATI.length).replace(/\s/g, '');
    }

    delete ret.DATI;

    let str = '//SR//FR/NOR';

    for (const key in ret) {
        if (key === 'AU') {
            str += `//DA/${ret.DA}//TI/${ret.TI}//AU/${ret[key]}`;
        } else {
            if (key !== 'DA' && key !== 'TI') {
                str += `//${key}/${ret[key]}`;
            }
        }
    }

    str += '//ER//'

    return str;
};