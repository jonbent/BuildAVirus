const confirmStart = require('./modalTypes/confirmStart');
const upgradePaths = require('./modalTypes/upgradePaths');
const fatalityPaths = require('./modalTypes/fatalityPaths');
module.exports = (modalType, options = {}) => {
    let modal;
    switch(modalType){
        case "confirmStart":
            modal = confirmStart;
            break;
        case "upgradePaths":
            modal = upgradePaths(options);
            break;
        case "fatalityPaths":
            modal = fatalityPaths(options);
            break;
        default:
            modal = confirmStart;
            break;
    }

    return `<div id="modal-container">
                <div id="modal-child">
                    ${modal}
                </div>
            </div>`
};