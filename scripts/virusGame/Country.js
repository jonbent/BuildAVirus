const Airport = require('./abilities/Airport');
const darkenHexColors = require('../darkenHexColors');

module.exports = class Country {
    constructor({airports, infected, numInfected, spreadRate, spreadChance, id, properties, population, hasPorts, game}) {
        if (airports) this.airports = airports.map(a => new Airport({...a, game}));
        this.infected = infected;
        this.numInfected = numInfected;
        this.spreadRate = Math.floor(Math.random() * 3000) + 1000;
        this.spreadChance = 30;
        this.id = id;
        this.properties = properties;
        this.population = population;
        this.hasPorts = hasPorts;
        this.game = game;
    }
    numAlive(){
        return this.population - this.numInfected;
    }

    tick(){
        this.airportTick();
    }
    airportTick(){
        if (!this.airports) return null
        const gameCountryKeys = Object.keys(this.game.countries);
        const interval = setInterval(() => {
            let selfRandomAirportIndex = Math.floor(Math.random() * this.airports.length);
            const ownAirport = this.airports[selfRandomAirportIndex];

            if (ownAirport.closed) clearInterval(interval);

            let randomCountryIndex = Math.floor(Math.random() * gameCountryKeys.length);
            while (this.game.countries[gameCountryKeys[randomCountryIndex]] === this || !this.game.countries[gameCountryKeys[randomCountryIndex]].airports) randomCountryIndex = Math.floor(Math.random() * gameCountryKeys.length);

            const randomCountry = this.game.countries[gameCountryKeys[randomCountryIndex]]
            const randomCountrysAirportIndex = Math.floor(Math.random() * randomCountry.airports.length);
            const randomAirport = randomCountry.airports[randomCountrysAirportIndex];

            this.game.arcs.push({
                origin: {
                    latitude: ownAirport.lat,
                    longitude: ownAirport.long
                },
                destination: {
                    latitude: randomAirport.lat,
                    longitude: randomAirport.long
                }
            });
            this.game.map.arc(this.game.arcs);
            if (this.numInfected > 0){
                ownAirport.infect(randomCountry);
            }
            setTimeout(() => this.game.arcs.splice(0,1), 2000);
            this.game.map.arc(this.game.arcs);
        }, Math.floor(Math.random() * 100000) + 10000)
    }
    startSpread(){
        const interval = setInterval(() => {
            const max = Math.floor(this.numAlive() / 1000) + 10;
            if (this.spreadRate === 0 || this.numInfected === this.population) {clearInterval(interval); return null}
            let count = 0;
            Math.floor(this.spreadChance * this.numInfected);
            // for(let i = 0; i < this.numInfected(countryName); i++){
            //     const randPercent = Math.random() * 100;
            //     if (randPercent >= this.countries[countryName].spreadChance) count += 1;
            // }

            count = Math.round((100 / this.spreadChance) * this.numInfected);
            if (count > max) count = max;
            if (this.numInfected + count > this.population){
                this.numInfected = this.population
            } else {
                this.numInfected += count;
            }

            if (this.game.numInfected() > this.game.totalPop() / 5 && !this.game.eventsStarted) this.game.startEvents();
            // console.log(this.numInfected(countryName))
            this.game.map.updateChoropleth({
                [this.id]: darkenHexColors('DD1C1A', Math.round( (this.numInfected / this.population)))
            })
        }, this.spreadRate );
    }
}