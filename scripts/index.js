const Game = require('./virusGame/Game.js');
const BlackPlague = require('./virusGame/virusClasses/BlackPlague');
const SmallPox = require('./virusGame/virusClasses/SmallPox');
// window.country_pop = require('../json/country_populations');
// window.airports = require('../json/airports');
const arrowInCircle = require('../html/svg/arrow-in-circle');
document.addEventListener('DOMContentLoaded', () => {
    virusSelectHandler();
});
const virusSelectHandler = () => {
    document.querySelector('.splash-card').addEventListener('click', e => {
        switch(e.target.innerHTML){
            case 'Small Pox':
                renderModal();
                renderMap(SmallPox);
                break;
            case 'Bubonic Plague':
                renderModal();
                renderMap(BlackPlague);
                break;
            default:
                break;
        }
    });
};
const modalConfirmHandler = () => {
    document.querySelector('#modal-body button').addEventListener('click', () => {
        closeModal();
    })
}
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
                        <div id="side-bar-header">World News</div>
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
                    <div id="game-actions">
                        <div>${arrowInCircle}</div>
                    </div>
                </div>
            </div>`;

        window.game = new Game(virus);
    };