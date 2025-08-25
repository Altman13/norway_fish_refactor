export const getCode = (data, name, weight) => {
    const getObj = (el) => el.name.trim() === name.value.trim();
    const result = JSON.parse(JSON.stringify(data.find(getObj)));

    if (weight) {
        result.id = data.findIndex(el => el.code === result.code);
        result.weight = +weight.value;
    }

    return result;
}