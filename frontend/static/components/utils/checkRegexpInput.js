import {getLastIdString} from './getLastIdString.js';
import {findElement} from './managmentDOM/controlElement.js';

export const checkRegexpInput = (component) => {
    const obCodes = ['CA', 'CC', 'KG', 'OB', 'RJ', 'US'];
    const lsCodes = ['LS', 'PV', 'VC'];
    const tfCodes = ['OI', 'PA', 'PC', 'RC', 'TF', 'TT'];
    const zoCodes = ['AD', 'CM', 'CS', 'EZ', 'FR', 'FS', 'FT', 'PF', 'PS', 'ZO', 'SN', 'TM'];
    const geCodes = ['GE', 'TP'];
    const ciCodes = ['CI', 'IN', 'LF', 'MC'];
    const meCodes = ['GL', 'LE', 'ME', 'HF'];
    const goCodes = ['BE', 'GO'];

    const code = component.getAttribute('code');
    const findCode = (arr) => arr.find(c => c.toLowerCase() === code)?.toLowerCase();
    console.log('code', code)
    switch (code) {
        // case 'po': checker(component, /^.{1,20}$/g); break;
        // case 'ds': checker(component, /^(([A-Z]{3})([ ])?)*$/g); break;
        // case 'ac': checker(component, /^(ANC|DRI|FIS|GUD|HAU|PRO|REL|SCR|STE|TRX|OTH|SET|INW|SEF)$/g); break;
        // case 'qi': checker(component, /^[1-7]$/g); break;
        // case 'gp': checker(component, /^[0-8]{1}$/g); break;
        // case 'ss': checker(component, /^(NOR01|NOR02)$/g); break;
        // CQ	\d{1,6}
        // CS	[A-Z]{3}
        // DA	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // DD	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // DF	(0?\d{1,2}|[0-2]\d{2}|3[0-5]\d|36[0-5])
        // DL	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // DS	(([A-Z]{3})([ ])?)*
        // DU	\d{1,5}
        // ED	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // ER	()
        // EZ	[A-Z]{3}
        // FA	(PET|PAM)
        // FC	\w{3}
        // FI	\d{1}(\.\d{1})?
        // FL	.{1,20}
        // FM	D|C|M
        // FO	[0-9]{1,5}
        // FR	[A-Z]{3}
        // FS	[A-Z]{3}
        // FT	[A-Z]{3}
        // GD	\d{1,4}
        // GE	\w{1,3}
        // GL	\d{1,4}
        // GN	[0-9]{2}-[0-9]{1,4}( [0-9]{2}-[0-9]{1,4}){0,5}
        // GO	\d{1,2}
        // GP	[0-8]{1}
        // GS	\d{1,3}
        // HA	([Yy]([Ee][Ss])?|[Nn][Oo]?)
        // HF	.{1,4}
        // HL	(([0][0-9]|[1][0-9]|[2][0-3])([0-5][0-9]))|(2400)
        // ID	\d{1,10}
        // IN	\d{1,3}
        // IR	.{1,12}
        // IS	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // KG	(([A-Z]{3})([ ])?(\d{1,7})([ ])?)*
        // LA	([NS])((([0-8][0-9])([0-5][0-9]))|(9000))
        // LB	([Yy]([Ee][Ss])?|[Nn][Oo]?)
        // LE	\d{1,4}
        // LF	\d{1,3}
        // LG	([-+]?)((([0]?[0-9]?[0-9]|[1]?[0-7]?[0-9])\.(\d{1,}))|(180.[0]{1,}))
        // LI	([NS])((([0-8][0-9])([0-5][0-9]))|(9000))
        // LN	([EW])((([0][0-9][0-9]|[1][0-7][0-9])([0-5][0-9]))|(18000))
        // LO	([EW])((([0][0-9][0-9]|[1][0-7][0-9])([0-5][0-9]))|(18000))
        // LS	.{1,60}
        // LT	([-+]?)((([0-8]?[0-9])\.(\d{1,}))|(90.[0]{1,}))
        // MA	(.|\x85){1,60}
        // MC	\d{1,3}
        // ME	\d{1,4}
        // MI	(VES|AIR|HEL)
        // MS	(.|\x85)*
        // MT	(DIM|SQM)
        // MV	\d{1,4}
        // NA	(.|\x85){1,30}
        // NE	\d{1,7}
        // NU	\d{1,7}
        // OB	(([A-Z]{3})([ ])?(\d{1,7})([ ])?)*
        // OI	[A-Z0-9]{4,7}
        // ON	.{1,30}
        // OO	Y|N
        // OS	\d{0,3}
        // PA	[A-Z0-9]{4,7}
        // PC	[A-Z0-9]{4,7}
        // PD	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // PF	[A-Z]{3}
        // PH	(Y|N)
        // PN	.{1,30}
        // PO	.{1,20}
        // PQ	.{1}
        // PR	(CBF|CLA|CUT|DWT|FIL|FIS|FSB|FSP|GHT|GTA|GTF|GUG|GUH|GUL|GUS|GUT|HEA|HET|JAP|JAT|LAP|OTH|PEL|SAD|SAL|SGH|SGT|SKI|SUR|TAL|TLD|TUB|WHL|WNG|LVR|ROE|TNG|[A-P]|LVR-C|ROE-C|TNG-C)
        // PS	[A-Z]{3}
        // PT	(([0][0-9]|[1][0-9]|[2][0-3])([0-5][0-9]))|(2400)
        // PV	.{1,60}
        // QI	[1-7]
        // RA	.{1,6}
        // RC	[A-Z0-9]{4,7}
        // RD	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // RE	\d{3}
        // RJ	(([A-Z]{3})([ ])?(\d{1,7})([ ])?)*
        // RN	\d{1,17}
        // RS	(ACK|NAK)
        // RT	(([0][0-9]|[1][0-9]|[2][0-3])([0-5][0-9]))|(2400)
        // RX	\d{1,17}
        // RY	(19|[2-9]\d{1})\d{2}
        // SD	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // SE	1|2
        // SN	[A-Z]{3}
        // SP	\d{1,4}(\.\d{1})?
        // SQ	\d{1,6}
        // SR	()
        // SS	(NOR01|NOR02)
        // TE	.*
        // TF	[A-Z0-9]{4,7}
        // TI	(([0][0-9]|[1][0-9]|[2][0-3])([0-5][0-9]))|(2400)
        // TL	.*
        // TM	[A-Z]{3}
        // TN	((?!(000|00$|0$))\d{1,3})
        // TP	\w{1,3}
        // TT	[A-Z0-9]{4,7}
        // TY	(CRT|BOX|BGS|BLC|CNT)
        // US	(([A-Z]{3})([ ])?(\d{1,7})([ ])?)*
        // VC	.{1,60}
        // VL	(OA|PP)[ ]?\d{1,3}
        // VO	.*
        // VP	(HP|KW)[ ]?\d{1,5}
        // VT	(OC|LC)[ ]?\d{1,5}
        // XG	([-+]?)((([0]?[0-9]?[0-9]|[1]?[0-7]?[0-9])\.(\d{1,}))|(180.[0]{1,}))
        // XR	.{1,14}
        // XT	([-+]?)((([0-8]?[0-9])\.(\d{1,}))|(90.[0]{1,}))
        // ZA	([-+]?)((([0-8]?[0-9])\.(\d{1,}))|(90.[0]{1,}))
        // ZD	(19|[2-9]\d{1})((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229)
        // ZG	([-+]?)((([0]?[0-9]?[0-9]|[1]?[0-7]?[0-9])\.(\d{1,}))|(180.[0]{1,}))
        // ZO	[A-Z]{3}
        // ZT	(([0][0-9]|[1][0-9]|[2][0-3])([0-5][0-9]))|(2400)


        case 'fo': checker(component, /^[0-9]{1,5}$/g); break;
        case 'tt': checker(component, /^([a-zA-Z0-9]+)$/g); break;
        case 'ls': checker(component, /^\d/g); break;
        case 'se': checker(component, /^1|2$/g); break;
        case 'gn': checker(component, /^[0-9]{2}-[0-9]{1,4}( [0-9]{2}-[0-9]{1,4}){0,5}$/g); break;
        case 'bm': checker(component, /^([A|B|C]([ ]*)([+]?)([0-9]{1,3})([ ]?)){3}$/g); break;
        case findCode(goCodes): checker(component, /^\d{1,2}$/g); break;
        case findCode(meCodes): checker(component, /^\d{1,4}$/g); break;
        case findCode(ciCodes): checker(component, /^\d{1,3}$/g); break;
        // case findCode(geCodes): checker(component, /^\w{1,3}$/g); break;
        // case findCode(zoCodes): checker(component, /^[A-Z]{3}$/g); break;
        case findCode(lsCodes): checker(component, /^.{1,60}$/g); break;
        case findCode(tfCodes): checker(component, /^[A-Z0-9]{4,7}$/g); break;
        // case findCode(obCodes): checker(component, /^(([A-Z]{3})([ ])?(\d{1,7})([ ])?)*$/g); break;
    }
};

const checker = (component, regexp) => {
    const type = component.getAttribute('title');
    const id = getLastIdString(component.getAttribute('id'));
    const nextBtn = findElement(`.btn-send-${type}-${id}`);

    if (component.value.match(regexp)) {
        setStyleField(component, nextBtn, false, 'green');
    } else {
        setStyleField(component, nextBtn, true, 'red');
    }
};

const setStyleField = (component, btn, isDisabled, color) => {
    btn.disabled = isDisabled;
    component.style.border = `1px solid ${color}`;
};