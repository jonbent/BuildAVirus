// concept
    // start out with base infectivity
    // increase based on symptom upgrades
    // decrease randomly based on events
    // increase randomly based on events
    // continue until infectivity is 0 or population is 0

// infectivity
  // generated based on given virus
  // combination of spread amount / deadliness
const Board = require('./Board');

const Country = require('./Country');
const events = require('../../json/events.json');
const countries = require('../../json/country_populations');
const worldInfoItem = require('../../html/world-info-item');



module.exports = class Game {
    constructor(virus) {
        this.startGame()
        this.board = new Board({map: this.map, game: this});
        this.events = events;
        this.intervals = {};
        this.started = false;
        this.eventsStarted = false;
        this.pointsSpent = 0;
        this.points = 0;
        this.virus = new virus({game: this});
        window.virus = this.virus

        const newCountries = {};
        Object.keys(countries).forEach(cName => {
            let newCountry = countries[cName];
            newCountry.infected = false;
            newCountry.numInfected = 0;
            newCountry.spreadRate = 0;
            newCountry.spreadChance = 0;
            newCountry.fillColor = "#DD1C1A";
            newCountry.game = this;
            newCountries[cName] = new Country(newCountry);
        });
        this.arcs = [];
        this.countries = newCountries;
        this.countryKeys = Object.keys(this.countries);
        this.spreadChance = 0;
        this.numBubblesClicked = 0;
        this.selectedCountry = null;
        this.startingCountry = null;

        // this.startEvents();
    }
    calculateTotalPoints(){
        let total = 0;
        this.countryKeys.forEach(key => {
            const curCountry = this.countries[key];
            total += Math.round((curCountry.numInfected / curCountry.population) * 100);
        });
        total += this.numBubblesClicked * 100;
        return total
    }
    startGame(){
         this.map = new Datamap({
            element: document.getElementById('world-map'),
            scope: 'world',
            height: null, // If not null, datamaps will grab the height of 'element'
            width: null, // If not null, datamaps will grab the width of 'element',
            fills: {
                defaultFill: 'red', // Any hex, color name or rgb/rgba value

            },
            geographyConfig: {
                popupTemplate: this.popupTemplate(),
                highlightFillColor: () => 'red'
            }
        });
        this.countrySelectHandler();
        this.upgradeButtonHandler();
    }
    getCountry(countryName){
        if (!countryName || !this.countries[countryName]) return null;
        return this.countries[countryName];
    }
    popupTemplate(){
        const that = this;
        return (geo, data) => {
            if (that.startingCountry === null) {
                return `
                    <div class="country-select" style="">
                        <div class="hoverinfo">
                            <strong>${geo.properties.name}</strong>
                        </div>
                    </div>
                `
            } else {
                return ''
            }
        }
    }
    countrySelectHandler(){
        this.map.svg.selectAll('.datamaps-subunit').on('click', geo => {
            const worldInfo = document.querySelector('#world-info');
            const worldInfoSpecific = document.querySelector('#world-info-specific');
            if (!this.startingCountry) {
                worldInfo.classList.add('started');
                worldInfoSpecific.classList.add('started');
            }

            let info = {name: geo.properties.name, populationTotal: this.totalPop(geo.properties.name), populationNow: this.numAlive(geo.properties.name)}
            this.selectedCountry = geo.properties.name;
            if (!this.startingCountry) {
                this.startingCountry = geo.properties.name;
                this.infectCountry(this.countries[geo.properties.name]);
                document.querySelector('.country-select').style.display = 'none';
                // this.setSpread(geo.properties.name, 1000);
                // this.countries[geo.properties.name].spreadChance = 60;
                this.updateInfoPanel();
                this.countryKeys.forEach(c => this.countries[c].tick());
                this.countries[this.selectedCountry].startSpread()
                this.board.generateBubble({event: {title: `${this.selectedCountry} has been infected`, description: `${this.virus.name} has started taking control of it's hosts`}, location: this.countries[this.selectedCountry]})
            } else {
                worldInfoSpecific.innerHTML = worldInfoItem(info);
                worldInfoSpecific.style.opacity = '1';
                worldInfo.style.opacity = '0';
                setTimeout(() => {
                    worldInfoSpecific.style.opacity = '0';
                    worldInfo.style.opacity = '1';
                }, 10000)
            }

        });
    }
    renderUpgradeModal(){
        window.renderModal('upgradePaths', {virus: this.virus})
        document.querySelectorAll('.modal-upgrades > div').forEach(el => {
            const upgradeType = el.id.split('-')[0];
            el.querySelector('.input-and-action svg').addEventListener('click', () => {
                this.purchaseUpgrade(upgradeType);
            })
        })
    }
    upgradeButtonHandler(){
        document.querySelector('#upgrade-arrow').addEventListener('click', () => {
            this.renderUpgradeModal()
        })
    }
    purchaseUpgrade(type){
        const numPoints = this.virus.getUpgradeCost(type);
        if (numPoints <= this.points ){
            this.pointsSpent += numPoints;
            this.virus.upgradeAbility(type);
            this.renderUpgradeModal()
        } else {
            console.log('this is not enough')
        }
    }
    infectCountry(country, startCountry = null, num = 1){
        if (startCountry) num = startCountry.numInfected > 0 ? num : 0;
        if (country){
            country.numInfected += num;
        }
        console.log(num)
        if (num === 0) return false;
        return true;
    }

    gameOver(){
        if (this.numInfected() === this.totalPop() || this.totalSpreadChance() === 0) return true;
        return false;
    }
    won(){
        return this.totalSpreadChance() === 0 ?  false : true;
    }

    totalSpreadChance(countryName = null){
        if (countryName) return this.countries[countryName].spreadRate;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].spreadRate;
        });
    }
    numInfected(countryName = null){
        if (countryName) return this.countries[countryName].numInfected;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].numInfected;
        });
    }

    numAlive(countryName = null){
        if (countryName) return this.countries[countryName].population - this.countries[countryName].numInfected;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].population - this.countries[cName].numInfected;
        });
    }
    totalPop(countryName = null){
        if (countryName) return this.countries[countryName].population;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].population
        });
    }
    setSpread(countryName, spread){
        if (countryName && spread !== undefined){
            this.countries[countryName].spreadRate = spread;
        }
    }
    startSpread(countryName){
        if (!this.started) setInterval(() => document.querySelector('#world-info').innerHTML = worldInfoItem( {name: 'World', populationTotal: this.totalPop(), populationNow: this.numAlive()}))
        // }, this.countries[countryName].spreadRate );
    }
    startEvents(){
        this.eventsStarted = true;
        const min = 30000, max = 7000;
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        const randEvent = Math.floor(Math.random() * this.events.length);
        const randCountry = Math.floor(Math.random() * this.countryKeys.length);
        this.board.generateBubble({event: this.events[randEvent], location: this.countries[this.countryKeys[randCountry]]});
        setTimeout(() => this.startEvents(), rand)
    }
    updateInfoPanel(){
        setInterval(() => {
            const totalPoints = this.calculateTotalPoints();
            this.points = totalPoints - this.pointsSpent;
            const statsContainer = document.querySelector('#stats');
            statsContainer.querySelector('#points-current').innerHTML = this.points;
            statsContainer.querySelector('#points-spent').innerHTML = this.pointsSpent;
            statsContainer.querySelector('#points-gained').innerHTML = totalPoints;
            const worldInfo = document.querySelector('#world-info');
            const worldInfoSpecific = document.querySelector('#world-info-specific')
            let info = {name: this.selectedCountry, populationTotal: this.totalPop(this.selectedCountry), populationNow: this.numAlive(this.selectedCountry)};
            worldInfoSpecific.innerHTML = worldInfoItem(info);
            info = {name: 'World', populationTotal: this.totalPop(), populationNow: this.numAlive()};
            worldInfo.innerHTML = worldInfoItem(info);
        }, 1000);

    }
}

