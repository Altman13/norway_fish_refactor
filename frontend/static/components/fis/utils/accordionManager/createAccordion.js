export const templateContainerAccordion = (data) =>
    `
        <div class="accordion accordion-${data.title}-${data.id}" id="accordionExample"></div>
        <a href="${localStorage.backpage}" class="btn-${data.title}-backpage" 
        type="button" hidden data-link>CLICK ME PLS</a>
    `

export const templateAccordion = (data) =>
    ` 
        <div class="accordion-item accordion-child-${data.title}-${data.id} mb-3">
            <h2 class="accordion-header" id="heading${data.id}">
                <button class="accordion-button title-${data.title}-${data.id} d-flex collapsed" 
                type="button"
                data-bs-toggle="collapse" 
                data-bs-target="#collapse${data.title}${data.id}"
                aria-expanded="false" 
                id="accordion-${data.title}-${data.id}" 
                aria-controls="collapse${data.title}${data.id}"
                title="${data.name}">
                    <div class="title-value-${data.title}-${data.id} me-3">${data.name}</div>
                    <div class="content-${data.title}-${data.id} w-50 d-flex flex-column justify-content-center align-items-center" style="color: #0a53be"></div>
                </button>
            </h2>
            <div id="collapse${data.title}${data.id}" class="accordion-collapse collapse" aria-labelledby="heading${data.id}"
            data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    ${data.component}
                </div>
                    ${data.btn}
            </div>
        </div>
    `