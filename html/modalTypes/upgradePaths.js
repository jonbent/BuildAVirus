const birdSvg = require('../svg/bird-icon');
const mosquito = require('../svg/mosquito');
const arrow = require('../svg/arrow-outline');
module.exports = ({virus, upgradeHandler}) => {
        return `
            <div id="modal-title">Upgrade Virus</div>
            <div id="modal-body">
                   <div class="modal-upgrades">
                           <div id="bird-actions">
                                ${birdSvg}
                                <div class="input-and-action">
                                       <input readonly value="${virus.abilities.bird}"/>
                                       <div>${arrow}</div>      
                                </div>
                           </div>
                           <div id="mosquito-actions">
                                ${mosquito}
                                <div class="input-and-action">
                                       <input readonly value="${virus.abilities.mosquito}"/>
                                       <div>${arrow}</div>           
                                </div>
                           </div>
                   </div>
                   <button class="confirm-button">Confirm</button>
            </div>
        
        `
};