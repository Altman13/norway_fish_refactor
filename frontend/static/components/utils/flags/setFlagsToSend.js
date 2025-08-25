export const setFlagsToSend = (isSend = false,
                               isAsync = false,
                               isSync = false,
                               isCancel = false) => {
    return {
        send: isSend,
        isAsync,
        isSync,
        isCancel,
    };
};