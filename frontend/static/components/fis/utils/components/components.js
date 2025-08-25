export const templateSelect = (data) =>
    `
        <input class="datalist-${data.title}-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} form-control" 
            list="datalistOptions-${data.title}-${data.id}" 
            value="${data.value ? data.value : ''}" title="${data.title}" 
            code="${data.code}" id="fis-${data.title}-${data.id}"
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}"
        >
        <datalist id="datalistOptions-${data.title}-${data.id}"></datalist> 
    `

export const templateInput = (data) =>
    `
        <div class="input-group mb-3">           
            <input type="text" class="input-text-loop1-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} form-control" 
            placeholder="Free text" title="${data.title}" 
            value="${data.value ? data.value : ''}"     
            id="${data.title}-${data.id}"      
            code="${data.code}" aria-label="FreeText"
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}"
            >                                        
        </div>
    `

export const templateInputLoop3 = (data) =>
    `
        <div class="input-group mt-3 mb-3">
            <input type="text" class="input-text-${data.id} ${data.title}-exit form-control" placeholder="Dybde" 
            aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn-${data.title}-${data.id} btn btn-primary text-uppercase" type="button" id="button-addon2">Hent fra Ekko.l</button>
        </div>                        
    `

export const templateButton = (data) =>
    `
        <div class="btn-group-${data.id} btn-group mt-3 btn-group-lg d-flex justify-content-center" role="group"
                 aria-label="Basic example">
            <button type="button" id="back-${data.title}-${data.id}" class="btn-cancel-${data.title}-${data.id} btn-cancel btn btn-outline-danger text-uppercase">Tilbake</button>
            <button type="button" id="next-${data.title}-${data.id}" class="${data.last ? 'last-' : ''}btn-send-${data.title}-${data.id} btn-send btn btn-outline-success text-uppercase">Neste</button>
        </div>         
    `

export const templateSendButton = (data) =>
    `
        <div class="btn-group-${data.id} btn-group mt-3 btn-group-lg d-flex justify-content-center" role="group"
                 aria-label="Basic example">
            <button type="button" class="btn-send-${data.title}-${data.id} btn-send btn btn-outline-success text-uppercase">Send</button>
        </div>         
    `

export const templateDca = (data) =>
    `
        <ul class="nav nav-pills d-flex justify-content-center my-3" id="pills-tab" role="tablist">
        
            <li class="nav-item" role="presentation">
            <button class="nav-link active" id="new-${data.title}-${data.id}" data-bs-toggle="pill" data-bs-target="#pills-home" 
            type="button" role="tab" aria-controls="pills-home" aria-selected="true">New DCA</button>
            </li>
            
            <li class="nav-item" role="presentation">
            <button class="nav-link" id="old-${data.title}-${data.id}" data-bs-toggle="pill" data-bs-target="#pills-profile" 
            type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Old DCA</button>
            </li>
        
        </ul>
        
        <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane insert-new-dca fade show active" id="pills-home" role="tabpanel" 
            aria-labelledby="new-${data.title}-${data.id}"></div>
            <div class="tab-pane insert-old-dca fade" id="pills-profile" role="tabpanel" 
            aria-labelledby="old-${data.title}-${data.id}"></div>
        </div>
    `

export const templatePositionTemp = (data) =>
    `
        <div class="accordion-body">
            <input class="datalist-${data.title}-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} mb-3 form-control" list="datalistOptions-${data.title}-${data.id}" 
            id="${data.title}-${data.id}" 
            code="${data.code}" 
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}">
            <datalist id="datalistOptions-${data.title}-${data.id}"></datalist> 
            ${templatePosition(data)}
        </div>
    `

export const templateDepPositionTemp = (data) =>
    `
        <div class="accordion-body">
            <input class="datalist-${data.title}-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} mb-3 form-control" list="datalistOptions-${data.title}-${data.id}" 
            id="${data.title}-${data.id}" 
            code="${data.code}" 
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}">
            <datalist id="datalistOptions-${data.title}-${data.id}"></datalist> 
            ${templateDepPosition(data)}
        </div>
    `

export const templatePosition = (data) =>
    `
        <div class="input-group mb-3">
            <span class="input-group-text">Bredde</span>
            <input type="text" id="${data.id}" aria-label="Bredde" 
            class="input-bredde-${data.title}-${data.id} ${data.title}-exit form-control"
            code="${data.code}${data.id}" 
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Lendge</span>
            <input type="text" id="${data.id}" aria-label="Lendge" 
            class="input-lendge-${data.title}-${data.id} ${data.title}-exit form-control"
            code="${data.code}${data.id + 1}" 
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}">
        </div>
    `

export const templateDepPosition = (data) =>
    `
        <div class="input-group mb-3">
            <span class="input-group-text">Bredde</span>
            <input type="text" id="${data.id}" aria-label="Bredde" 
            class="input-bredde-${data.title}-${data.id} ${data.title}-exit form-control"
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text">Lendge</span>
            <input type="text" id="${data.id}" aria-label="Lendge" 
            class="input-lendge-${data.title}-${data.id} ${data.title}-exit form-control"
        </div>
    `

export const templateDate = (data) =>
    `
         <div class="accordion-body d-flex justify-content-center w-auto">
            <input type="datetime-local" id="fis-${data.title}-${data.id}" 
            class="datetime-${data.title}-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} datetime-local"        
            code="${data.code}"
            block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}"
            >  
         </div>               
    `

export const templateRegister = (data) =>
    `
        <div class="accordion-body">              
            <div class="input-group mb-3 w-100">                
                <input class="datalist-${data.title}-${data.id} ${data.title}-exit show-title-${data.title}-${data.id} form-control" list="datalistOptions-${data.title}-${data.id}" 
                id="${data.title}-${data.id}" code=${data.code} block="${data.blockB >= 0 ? 'blockB' + data.blockB : ''}">
                <datalist id="datalistOptions-${data.title}-${data.id}"></datalist>                
                <input type="number" class="input-text-${data.title}-${data.id} form-control" aria-label="weight" 
                aria-describedby="basic-addon1">
                <span class="input-group-text">kg</span>
            </div>
            
            <div class="btn-group btn-group-lg d-flex justify-content-center" role="group"
                aria-label="Basic example">                
                <button type="button" class="hent-${data.title}-${data.id} btn btn-primary mb-3 text-uppercase me-1">Hent fra vekt</button>
               <button type="button" id="${data.id}" class="reg-${data.title}-${data.id} btn btn-primary mb-3 text-uppercase">Registrer</button>                                             
            </div>   
                ${data.table ? data.table : ''}
           <div class="list-OB" style="overflow:auto; height: 150px;">                          
                <table class="table-${data.title}-${data.id} table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th class="th-name-${data.title}-${data.id}" scope="col">Name</th>
                            <th class="th-weight-${data.title}-${data.id}" scope="col">Weight</th>
                        </tr>
                    </thead>
                    <tbody class="tableHere-${data.id}"></tbody>
                </table>              
           </div>                                                                 
        </div> 
    `

export const templateTable = (data) =>
    `   
        <tr class="tr-${data.title}-${data.id}">
            <th scope="row">
                <img src="/static/icons/NG.svg" height="20" width="20" id="${data.id}" class="delete-${data.title}-${data.id}" alt="">
            </th>
            <td class="td-name-${data.title}-${data.id}">${data.name}</td>
            <td class="td-weight-${data.title}-${data.id}">
                <div class="input-group">                                    
                    <input type="text" id="${data.title}${data.id}" 
                    class="weight-${data.title}-${data.id} 
                    form-control" width="100" 
                    placeholder="Weight"                    
                    aria-label="Weight" aria-describedby="basic-addon1" value="${data.weight}">
                </div>
            </td>
        </tr>                         
`

export const templateMultiInput = (data) =>
    `
        <div class="accordion-body">
            <div class="input-group mb-3 d-flex">
                <p class="me-2">A-mm</p>
                <input type="text" class="input-a-text-${data.title}-${data.id} ${data.title}-exit form-control" code="${data.code}" 
                placeholder="Free text" aria-label="FreeText">                                        
            </div>
            <div class="input-group mb-3 d-flex">
                <p class="me-2">B-mm</p>
                <input type="text" class="input-b-text-${data.title}-${data.id} form-control" placeholder="Free text" aria-label="FreeText">                                        
            </div>
            <div class="input-group mb-3 d-flex">
                <p class="me-2">C-mm</p>
                <input type="text" class="input-c-text-${data.title}-${data.id} form-control" placeholder="Free text" aria-label="FreeText">                                        
            </div>
        </div>      
    `

export const templateFavFiskeomrade = (data) =>
    `
        <div class="list-group-fav mb-3" style="overflow: auto; height: 200px;">
            <ul class="list-group-${data.title}-${data.id} list-group"></ul>
        </div>

        <div class="input-group mb-3">
            <span class="input-group-text">Navn</span>
            <input type="text" aria-label="Navn" class="navn-${data.title}-${data.id} form-control">
        </div>
        
        <div class="input-group mb-3">
            <span class="input-group-text">Bredde</span>
            <input type="text" aria-label="Bredde" class="bredde-${data.title}-${data.id} form-control">
        </div>
        
        <div class="input-group mb-3">
            <span class="input-group-text">Lengde</span>
            <input type="text" aria-label="Lengde" class="lengde-${data.title}-${data.id} form-control">
        </div>
    `

export const templateFavFiskemottak = (data) =>
    `
        <div class="list-group-fav mb-3" style="overflow: auto; height: 200px;">
            <ul class="list-group">
                <li class="list-${data.title}-${data.id} list-group-item list-group-item-success text-uppercase mb-3">Fladen N5678 E4567</li>    
                <li class="list-${data.title}-${data.id} list-group-item list-group-item-success text-uppercase mb-3">Kanten N5678 E4567</li>    
                <li class="list-${data.title}-${data.id} list-group-item list-group-item-success text-uppercase mb-3">Feltet N5678 E4567</li>    
                <li class="list-${data.title}-${data.id} list-group-item list-group-item-success text-uppercase mb-3">Hola N5678 E4567</li>    
                <li class="list-${data.title}-${data.id} list-group-item list-group-item-success text-uppercase mb-3">Fiskeplass N5678 E4567</li>    
            </ul>                     
        </div>

        <div class="input-group mb-3">
            <span class="input-group-text">Havn</span>
            <input type="text" aria-label="First name" class="form-control">
        </div>
        
        <div class="input-group mb-3">
            <span class="input-group-text">Navn</span>
            <input type="text" aria-label="First name" class="form-control">
        </div>
    `
