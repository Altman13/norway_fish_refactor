export const templateTable = (data) =>
`   
    <tr class="tr-id-${data.id}">
        <th scope="row">
            <img src="/static/icons/NG.svg" height="20" width="20" id="${data.id}" class="delete-id-${data.id}" alt="" style="cursor: pointer;">
        </th>
        <td class="fishname-${data.type}-${data.id} ${data.code} td-name-id-${data.id}">${data.name}</td>
        <td class="td-weight-id-${data.id}">
            <div class="input-group">                                    
                <input type="text" id="${data.id}" class="${data.type}-weight-${data.uuid}-${data.id} form-control" width="100" placeholder="Weight" 
                aria-label="Weight" aria-describedby="basic-addon1" value="${data.weight}">
            </div>
        </td>
    </tr>                         
`