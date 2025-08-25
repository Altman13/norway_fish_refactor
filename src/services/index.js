const ret = {
    data: '',
    status_code: '',
    error: '',
}

export async function ajaxAction( url , method , data ) {
    try {
        let d
        let headers
        // if( data instanceof FormData ){
        //     d = data
        // }
        // else
        if ( data ) {
            d = JSON.stringify({ data })
            headers ={ 'Content-Type': 'application/json' }
        }
        
        await fetch(url, {
            "method": method,
            body: d,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            "headers" : headers,
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
            .then(( response ) => {
                ret.status_code = response.status.toString()
                return response.json()        
            })
            .then(( data ) => {
            ret.data = data
            })
    } catch ( err ) {
        ret.error = err
        console.log( err )
    }
    return ret
}