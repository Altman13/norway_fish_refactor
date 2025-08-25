export const templateBtn = (data) =>
    `
        <a href="" type="button" id="${data.id}" 
            class="btn-cancel-${data.title}-${data.id} w-100 btn-cancel btn btn-outline-danger text-uppercase"
            data-link>
            ${`Stopp fiskeoperasjon`.toUpperCase()}
        </a>
    `;

export const templateCardActive = (data) =>
    `
        <div class="card-title-${data.id} card text-dark ${data.status === 'ACTIVE' ? 'bg-primary' : 'bg-success'}" style="max-width: 100%;">
            <div class="card-header">
                <input type="text" status="${data.status}" id="${data.id}" class="name-fis-${data.id} form-control w-25" 
                placeholder="Name operation" value="${data.title}" aria-label="name">
            </div>
            <div class="card-body">
                <div class="p-3 mb-2 bg-light text-dark rounded-2 fs-3">${data.title} - ${data.date}</div>  
            </div>
        </div>      
    `;

export const templateMainBtn = () =>
    `
        <div class="btn-group btn-group-lg d-flex justify-content-center" role="group"
             aria-label="Basic example">
            <a class="btn-cancel-out nav-link link-danger text-uppercase btn btn-outline-danger" href="${localStorage.backpage}" data-link>Tilbake</a>
            <a href="/loop1" type="button" class="btn-reg-out btn btn-outline-primary" data-link>Rediger</a>
            <a class="btn-send-out-fis nav-link link-success text-uppercase btn btn-outline-success">Start</a>
        </div>
    `;

export const templateFis = (data) =>
    `
        <div class="${data.type}-operation">
            <div class="accordion-${data.id} mb-3" id="fis-${data.title}">
                <div class="accordion-item">
                    <h2 class="accordion-header d-flex align-items-center" id="${data.title}">
                        <button class="${data.title} accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapseOne${data.id}" aria-expanded="false" aria-controls="collapseOne${data.id}">
                            <img src="/static/icons/Fish.svg" height="20" width="20" 
                            class="status-img-${data.id} me-2" alt="">
                            ${data.title} ${data.date}
                        </button>
                    </h2>
                    <div id="collapseOne${data.id}" class="accordion-collapse collapse m-1" aria-labelledby="headingOne" 
                    data-bs-parent="#fis-${data.title}">
                            <div>${data.card}</div>
                            <div class="my-1">${data.btn}</div>
                    </div>
                </div>
            </div>    
        </div>   
    `;

export const templateDcaReady = (data) =>
    `
        <div class="${data.type}-operation">
            <div class="list-group mb-3">           
                <a href="/dca-edit"
                id="${data.id}"
                class="${data.type}-${data.id} list-group-item list-group-item-action list-group-item-success"
                data-link>${data.id} ${data.type.toUpperCase()} ${data.date}</a>
            </div>
        </div>   
    `;