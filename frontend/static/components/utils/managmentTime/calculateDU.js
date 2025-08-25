export const calculateDU = (startTime, finishTime) => {
    console.log(startTime, finishTime);
    return Math.ceil((finishTime.getTime() - startTime.getTime()) / 1000) / 60;
};