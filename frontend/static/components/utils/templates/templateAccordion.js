export const template = async (data, template) =>
    `
        <div class="main-template accordion-item mt-3 mb-3">
            <h2 class="accordion-header" id="panelsStayOpen-headingFive">
                <button class="accordion-button-id-${data.id}-${data.type} accordion-button ${data.acc}" type="button" 
                    data-bs-toggle="collapse"
                    data-bs-target="#${data.accordionId}" id="${data.id}-${data.type}" aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseFive"
                    value="${data.name}">
                <div class="d-flex w-100">
                    <div class="${data.type}-title">${data.name}</div>
                    <div class="insert-here-${data.type}-${data.id} accordion-button-id-${data.id}-${data.type} text-center w-50 d-flex flex-column">
                        <span class="text-${data.type}-${data.id} text-center" style="color: #0d6efd"></span>
                    </div>
                </div>
                </button>
            </h2>
            <div id="${data.accordionId}" class="${data.accordion} mt-3 mb-3"
                 aria-labelledby="panelsStayOpen-headingFive">
                    ${await template}
                 <div class="btn-group-${data.id} btn-group mt-3 btn-group-lg d-flex justify-content-center" role="group"
                         aria-label="Basic example">
                    <button type="button" id="${data.id}" class="btn-cancel-id-${data.id} btn-cancel btn btn-outline-danger text-uppercase">${data.cancelName}</button>
                    <button type="button" id="${data.id}" class="btn-send-id-${data.id} btn-send btn btn-outline-success text-uppercase">${data.sendName}</button>
                </div>     
            </div>
        </div>      
    `;