import {toDate} from "./toDate.js";

export const templateArchive = (data) =>
    `
        <div class="accordion-${data.id} mb-3" id="archive-${data.title}${data.id}">
            <div class="accordion-item">
                <h2 class="accordion-header" id="${data.title}${data.id}">
                    <button class="${data.title}-${data.id} accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapseOne${data.id}" aria-expanded="false" aria-controls="collapseOne${data.id}">
                        <img src="/static/icons/${data.ret ? (data.ret.RS === 'ACK' ? 'OK' : 'NG') : 'Warning'}.svg" 
                        height="20" width="20" class="me-3" alt="">
                        ${data.title} ${toDate(data.date)} ${data.ret && data.ret.RE === '522' ? data.ret.RS === 'ACK' ? 'Cancelled' : '' : ''}
                    </button>
                </h2>
                <div id="collapseOne${data.id}" class="accordion-collapse collapse" aria-labelledby="headingOne" 
                data-bs-parent="#archive-${data.title}${data.id}">
                    <div class="accordion-body">
                        <table class="table-archive-${data.id} w-100">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th class="text-end" scope="col">Value</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="insert-data-archive-${data.id}"></div>
                </div>
            </div>
        </div>       
    `