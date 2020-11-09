const cancer = require('../svg/cancer');
const finger = require('../svg/finger');
const arrow = require('../svg/arrow-outline');
module.exports = ({virus}) => {

        return `
            <div id="modal-title">Upgrade Virus's Fatality</div>
            <div id="modal-body">
               <div class="modal-upgrades">
                   <div class="action-row">
                       <div class="header">Fatal Upgrades</div>
                       <div class="actions" id="cancer-actions">
                            ${cancer}
                            <div class="input-and-action">
                               <input readonly value="${virus.fatalities.cancer}"/>
                            </div>
                       </div>
                       <div class="actions" id="finger-actions">
                            ${finger}
                            <div class="input-and-action">
                               <input readonly value="${virus.fatalities.finger}"/>
                            </div>
                       </div>
                   </div>
                   <div class="description-container"></div>
               </div>
               <button class="confirm-button">Confirm</button>
            </div>
        
        `
};