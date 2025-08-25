export const toPosition = (data) => {
    return `${data.LT.replace(/[+-]/g, 'N')} ${data.LG.replace(/[+-]/g, 'E')}`;
}