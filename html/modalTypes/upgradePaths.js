const birdSvg = require('../svg/bird-icon');
const mosquito = require('../svg/mosquito');
const congestion = require('../svg/runny-nose');
const contact = require('../svg/shaking-hands');
const arrow = require('../svg/arrow-outline');
module.exports = ({virus, upgradeHandler}) => {
        return `
            <div id="modal-title">Upgrade Virus Transmission</div>
            <div id="modal-body">
               <div class="modal-upgrades">
                   <div class="action-row">
                       <div class="header">Cross Country</div>
                       <div class="actions" id="bird-actions">
                            ${birdSvg}
                            <div class="input-and-action">
                                   <input readonly value="${virus.abilities.bird}"/>
                            </div>
                       </div>
                       <div class="actions" id="mosquito-actions">
                            ${mosquito}
                            <div class="input-and-action">
                                   <input readonly value="${virus.abilities.mosquito}"/>
                            </div>
                       </div>
                   </div>
                   <div class="action-row">
                       <div class="header">Domestic</div>
                       <div class="actions" id="congestion-actions">
                            ${congestion}
                            <div class="input-and-action">
                                   <input readonly value="${virus.abilities.congestion}"/>
                            </div>
                       </div>
                       <div class="actions" id="contact-actions">
                            ${contact}
                            <div class="input-and-action">
                                   <input readonly value="${virus.abilities.contact}"/>
                            </div>
                       </div>
                   </div>
                   <div class="description-container"></div>
               </div>
               <button class="confirm-button">Confirm</button>
            </div>
        
        `
};