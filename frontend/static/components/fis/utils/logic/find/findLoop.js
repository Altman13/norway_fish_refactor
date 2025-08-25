export const findCode = (data, type, field) => findLoopElement(data, type)?.data.find(e => e.name === field.value)?.code;
export const findCodeGe = (data, type, geStatus, field) => geStatus.indexOf(findCode(data, type, field));
export const findLoopElement = (data, type) => data.find(el => el.type === type);