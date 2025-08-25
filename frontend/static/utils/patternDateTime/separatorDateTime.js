const separatorDateTime = (data) => {
    const date = data.slice(0, 10).replace(/\s/gm, '-');
    const time = data.slice(11, data.length).replace(/\s/gm, '-');

    return `${date} ${time}`;
}

module.exports = separatorDateTime;