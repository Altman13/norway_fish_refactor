export const preparingArray = (data) => {
    const temp = [];
    const arr = JSON.parse(data);

    arr.forEach(el => {
        temp.push(el);
    });

    return temp;
}