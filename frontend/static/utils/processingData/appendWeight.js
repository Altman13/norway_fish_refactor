export const appendWeight = (arrFish, findElement) => {
    const ob = arrFish;
    console.log(ob)

    if (ob.length) {
        const getIndex = ob.findIndex(el => el.code === findElement.code);
        if (getIndex >= 0) {
            ob[getIndex].weight = +ob[getIndex].weight + +findElement.weight;
        } else {
            ob.push({...findElement})
        }
    } else {
        ob.push({...findElement})
    }

    return ob;
}