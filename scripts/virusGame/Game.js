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
        this.startGame();
        this.board = new Board({map: this.map, game: this});
        this.events = events;
        this.intervals = {};
        this.started = false;
        this.eventsStarted = false;
        this.pointsSpent = 0;
        this.points = 0;
        this.virus = new virus({game: this});
        const headerDescripton = document.createElement("span");
        headerDescripton.innerHTML = this.virus.name;
        document.querySelector("#side-bar-header").appendChild(headerDescripton);
        this.upgradeDescriptions = {
            mosquito: `Transmit ${this.virus.name} through mosquitos. This upgrade is more effective in poorer countries.`,
            bird: `Transmit ${this.virus.name} through birds. This upgrade is semi-effective all across the world.`,
            contact: `Transmit ${this.virus.name} through human contact. This upgrade is more effective in dense areas.`,
            congestion: `Transmit ${this.virus.name} through human contact. This upgrade is semi-effective all across the world.`,
        };
        window.virus = this.virus;

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
        this.selectedUpgrade = null;
    }
    calculateTotalPoints(){
        let total = 0;
        this.countryKeys.forEach(key => {
            const curCountry = this.countries[key];
            total += Math.round((curCountry.numInfected / curCountry.population) * 100) * 5;
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
             // responsive: true,
            fills: {
                defaultFill: 'rgb(0,128,0)', // Any hex, color name or rgb/rgba value

            },
            geographyConfig: {
                popupTemplate: this.popupTemplate(),
                highlightFillColor: () => 'yellow'
            }
        });
        this.countrySelectHandler();
        this.upgradeButtonHandler();
        this.fatalityButtonHandler();
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
            // console.log(this.countries[geo.properties.name].id);
            if (!this.startingCountry) {

            }

            let info = {name: geo.properties.name, totalPop: this.totalPop(geo.properties.name), healthyPop: this.numHealthy(geo.properties.name), infectedPop: this.numInfected(geo.properties.name), deadPop: this.numKilled(geo.properties.name)}
            this.selectedCountry = geo.properties.name;
            if (!this.startingCountry) {
                this.startingCountry = geo.properties.name;
                this.infectCountry(this.countries[geo.properties.name]);
                document.querySelector('.country-select').style.display = 'none';
                // this.setSpread(geo.properties.name, 1000);
                // this.countries[geo.properties.name].spreadChance = 60;
                this.updateInfoPanel();
                this.countryKeys.forEach(c => this.countries[c].tick());

                this.countries[this.selectedCountry].startSpread();

                this.board.generateBubble({event: {title: `${this.selectedCountry} has been infected`, description: `${this.virus.name} has started taking control of it's hosts`}, location: this.countries[this.selectedCountry]})
                worldInfo.classList.add('started');
                worldInfoSpecific.classList.add('started');
                this.map.updateChoropleth({
                    [this.countries[geo.properties.name].id]: 'red'
                });

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
        window.renderModal('upgradePaths', {virus: this.virus, selectedUpgrade: this.selectedUpgrade});
        document.querySelectorAll('.modal-upgrades > .action-row > .actions').forEach(el => {
            const upgradeType = el.id.split('-')[0];
            el.querySelector('svg g').addEventListener('click', () => {
                this.selectUpgrade(upgradeType);
            })
        })
    }
    renderFatalityModal(){
        window.renderModal('fatalityPaths', {virus: this.virus})
        // document.querySelectorAll('.modal-upgrades > div').forEach(el => {
        //     const upgradeType = el.id.split('-')[0];
            // el.querySelector('.input-and-action svg').addEventListener('click', () => {
            //     this.purchaseFatality(upgradeType);
            // })
        // })
    }
    upgradeButtonHandler(){
        document.querySelector('#upgrade-arrow').addEventListener('click', () => {
            this.renderUpgradeModal()
        })
    }
    fatalityButtonHandler(){
        document.querySelector('#upgrade-skull').addEventListener('click', () => {
            this.renderFatalityModal()
        })
    }
    selectUpgrade(upgrade){
        const descriptionContainer = document.querySelector('#modal-body > .modal-upgrades > .description-container');
        descriptionContainer.innerHTML = "";
        const description = document.createElement('div');
        description.classList.add('description');
        description.innerHTML = this.upgradeDescriptions[upgrade];
        const upgradeButton = document.createElement('div');
        upgradeButton.classList.add('upgrade-button');
        upgradeButton.innerHTML = "Upgrade";
        upgradeButton.addEventListener('click', () => this.purchaseUpgrade(upgrade));
        descriptionContainer.append(description, upgradeButton);
    }
    purchaseUpgrade(type){
        const numPoints = this.virus.getUpgradeCost(type);
        if (numPoints <= this.points ){
            this.pointsSpent += numPoints;
            this.virus.upgradeAbility(type);
            this.renderUpgradeModal();
        } else {
            console.log('this is not enough')
        }
    }
    purchaseFatality(type){
        const numPoints = this.virus.getFatalityCost(type);
        if (numPoints <= this.points ){
            this.pointsSpent += numPoints;
            this.virus.upgradeFatality(type);
            this.renderFatalityModal()
        } else {
            console.log('this is not enough')
        }
    }
    infectCountry(country, startCountry = null, num = 1){
        const returnVal = country.infected
        if (startCountry) num = startCountry.numInfected > 0 || (startCountry.numInfected === startCountry.numKilled && startCountry.numInfected > 0) ? num : 0;
        if (country){
            if (country.numInfected + num >= country.population){
                country.numInfected = country.population
            } else {
                country.numInfected += num;
            }
        }
        if (num > 0 && returnVal === false) return true;
        return false;
    }

    gameOver(){
        let killedOff = 0;
        let spreadRate = 0;
        this.countryKeys.forEach((key) => {
            if (this.countries[key].numInfected === this.countries[key].numKilled) killedOff += 1
        })
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

    numHealthy(countryName = null){
        if (countryName) return this.countries[countryName].population - this.countries[countryName].numInfected;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].population - this.countries[cName].numInfected;
        });
    }
    numAlive(countryName = null){
        if (countryName) return this.countries[countryName].numAlive();
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].numAlive();
        });
    }
    numKilled(countryName = null){
        if (countryName) return this.countries[countryName].numKilled;
        return this.countryKeys.reduce((acc, cName, idx) => {
            if (idx === 1) acc = 0;
            return acc + this.countries[cName].numKilled;
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
    startEvents(){
        this.eventsStarted = true;

        const min = 30000, max = 7000;
        const rand = Math.floor(Math.random() * (max - min + 1) + min);

        const randEvent = Math.floor(Math.random() * this.events.length);
        const randCountry = Math.floor(Math.random() * this.countryKeys.length);

        this.board.generateBubble({event: this.events[randEvent], location: this.countries[this.countryKeys[randCountry]]});
        this.countries[this.countryKeys[randCountry]].event(this.events[randEvent]);

        setTimeout(() => this.startEvents(), rand)
    }
    updateInfoPanel(){
        setInterval(() => {
            if (this.gameOver()) {
                const interval = setInterval(() => {}, 99999);
                for (var i = 1; i < interval; i++) clearInterval(i);
            }
            const totalPoints = this.calculateTotalPoints();
            this.points = totalPoints - this.pointsSpent;
            const statsContainer = document.querySelector('#stats');
            statsContainer.querySelector('#points-current').innerHTML = this.points;
            statsContainer.querySelector('#points-spent').innerHTML = this.pointsSpent;
            statsContainer.querySelector('#points-gained').innerHTML = totalPoints;
            const worldInfo = document.querySelector('#world-info');
            const worldInfoSpecific = document.querySelector('#world-info-specific')
            let info = {name: this.selectedCountry, totalPop: this.totalPop(this.selectedCountry), healthyPop: this.numHealthy(this.selectedCountry), infectedPop: this.numInfected(this.selectedCountry), deadPop: this.numKilled(this.selectedCountry)}
            worldInfoSpecific.innerHTML = worldInfoItem(info);
            info = {name: "World", totalPop: this.totalPop(), healthyPop: this.numHealthy(), infectedPop: this.numInfected(), deadPop: this.numKilled() };
            worldInfo.innerHTML = worldInfoItem(info);
        }, 1000);

    }
}

