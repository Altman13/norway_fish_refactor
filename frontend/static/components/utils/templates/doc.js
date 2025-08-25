export const doc = (data, flags) => {
    return {
        req: data.req,
        sendToStm: data.data,
        originalMsg: data.originalMsg,
        flags: flags,
    };
};