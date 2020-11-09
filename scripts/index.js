const Game = require('./virusGame/Game.js');
const BlackPlague = require('./virusGame/virusClasses/BlackPlague');
const SmallPox = require('./virusGame/virusClasses/SmallPox');
const Custom = require('./virusGame/virusClasses/Custom');
// window.country_pop = require('../json/country_populations');
// window.airports = require('../json/airports');
const arrowInCircle = require('../html/svg/arrow-in-circle');
const skullAndBones = require('../html/svg/skull-and-bones');
document.addEventListener('DOMContentLoaded', () => {
    virusSelectHandler();
});
const virusSelectHandler = () => {
    document.querySelector('.splash-selection').addEventListener('click', e => {
        if (e.target.classList.contains('selection-box') || e.target.classList.contains('button')){
            switch(e.target.innerHTML){
                case 'Small Pox':
                    renderModal();
                    renderMap(SmallPox);
                    break;
                case 'Bubonic Plague':
                    renderModal();
                    renderMap(BlackPlague);
                    break;
                case 'Custom':
                    const customVirus = document.createElement("div");
                    customVirus.classList.add('selection-box', 'custom-input');
                    const newVirus = document.createElement("input");
                    newVirus.placeholder = "Enter Custom Virus Name";
                    newVirus.classList.add("new-virus-input");
                    const submitNewVirusinput = document.createElement("div");
                    submitNewVirusinput.classList.add('button');
                    submitNewVirusinput.innerHTML = "Create";
                    customVirus.appendChild(newVirus);
                    customVirus.appendChild(submitNewVirusinput);
                    e.target.innerHTML = "";
                    e.target.parentNode.replaceChild(customVirus, e.target);
                    break;
                case "Create":
                    const input = e.target.parentNode.children[0];
                    if (input.value === "" || input.value.length > 20) {
                        const error = document.createElement("div");
                        error.classList.add("error");
                        error.innerHTML = "Virus must have a name with no more than 20 characters.";
                        e.currentTarget.appendChild(error);
                        break;
                    }
                    renderModal();
                    renderMap(Custom(e.target.parentNode.children[0].value));
                    break;
                default:
                    break;
            }

        }
    });
};
const modalConfirmHandler = () => {
    document.querySelector('#modal-body button').addEventListener('click', () => {
        closeModal();
    })
};
window.renderModal = (modalType = 'confirmStart', options = {}) => {
    document.querySelector('#modal').innerHTML = require('../html/modal')(modalType, options);
    modalConfirmHandler();
};

window.closeModal = () => {
     document.querySelector('#modal').innerHTML = "";
};

const renderMap = (virus) => {
        document.getElementById('content').innerHTML =
            `<div id="game-board">
                <div id="world-info"></div>
                <div id="world-info-specific"></div>
                <div id="world-map-container">
                    <div id="world-map"></div>
                    <div id="map-side-bar-container">
                        <div id="side-bar-header"><span>World News</span></div>
                        <div id="map-side-bar"></div>
                        <div id="side-bar-footer"></div>
                    </div>
                </div>
                <div id="map-bottom-bar">
                    <div id="stats">
                        <div>Current Points: <span id="points-current"></span></div>
                        <div>Points Spent: <span id="points-spent"></span></div>
                        <div>Points Gained: <span id="points-gained"></span></div>
                    </div>
                    <div id="game-actions-container">
                        <h3 class="header">Upgrades</h3>
                        <div id="game-actions">
                        
                            <div>${arrowInCircle}</div>
                            <div>${skullAndBones}</div>
                        </div>
                    </div>
                </div>
            </div>`;

        window.game = new Game(virus);
    };