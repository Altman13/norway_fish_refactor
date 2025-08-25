export const useHttp = async (url, method, data) => {

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
        method: method,
        headers: myHeaders,
        redirect: 'follow'
    };

    if (method === 'POST' || method === 'PUT') {
        requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);
    return await response.json();

};