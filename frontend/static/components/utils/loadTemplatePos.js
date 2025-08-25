import {findElement} from './managmentDOM/controlElement.js';

export const loadTemplatePos = (props) => {
    console.log(props)
    const position = findElement(`.datalist-${props.title}-${props.id}`);
    const iBredde = findElement(`.input-bredde-${props.title}-${props.id}`);
    const iLendge = findElement(`.input-lendge-${props.title}-${props.id}`);

    position.onchange = () => {
        const value = position.value;

        if (value) {
            const getElement = props.fav.find(el => el.navn === value);

            if (getElement) {
                iBredde.value = getElement.bredde;
                iLendge.value = getElement.lengde;

                iBredde.style.border = '1px solid green';
                iLendge.style.border = '1px solid green';

                iBredde.setAttribute('value', getElement.bredde);
                iLendge.setAttribute('value', getElement.lengde);
            }
        }
    };
};