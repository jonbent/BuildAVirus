const cancer = require('../svg/cancer');
const finger = require('../svg/finger');
const arrow = require('../svg/arrow-outline');
module.exports = ({virus}) => {

        return `
            <div id="modal-title">Upgrade Virus</div>
            <div id="modal-body">
                   <div class="modal-upgrades">
                           <div id="cancer-actions">
                                ${cancer}
                                <div class="input-and-action">
                                       <input readonly value="${virus.fatalities.cancer}"/>
                                       <div>${arrow}</div>      
                                </div>
                           </div>
                           <div id="finger-actions">
                                ${finger}
                                <div class="input-and-action">
                                       <input readonly value="${virus.fatalities.finger}"/>
                                       <div>${arrow}</div>           
                                </div>
                           </div>
                   </div>
                   <button class="confirm-button">Confirm</button>
            </div>
        
        `
};