export const templateModal = () =>
    `
        <!-- Button trigger modal -->
        <button type="button" class="updater-modal btn btn-primary" hidden data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Launch static backdrop modal
        </button>
        
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="updater-title modal-title" id="staticBackdropLabel"></h5>
                        <button type="button" class="btn-close" hidden data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex justify-content-center">
                        <span class="me-2">Updating...</span>
                        <div class="spinner-border text-success" role="status">
                            <span class="visually-hidden">Updating...</span>
                        </div>
                    </div>
                    <span class="d-flex justify-content-center" style="font-size: 12px; color: #d93c40">Please not reboot your device otherwise you risk damage it</span>
                    <div class="modal-footer">                      
                        <button type="button" class="updater-close btn btn-secondary" hidden data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" hidden>Understood</button>
                    </div>
                </div>
            </div>
        </div>
    `;