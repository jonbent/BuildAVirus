const Airport = require('./abilities/Airport');
const darkenHexColors = require('../darkenHexColors');

module.exports = class Country {
    constructor({airports, infected, numInfected, spreadRate, spreadChance, id, properties, population, hasPorts, game}) {
        if (airports) this.airports = airports.map(a => new Airport({...a, game, country: this}));
        this.infected = infected;
        this.numInfected = numInfected;
        this.numKilled = 0;
        this.spreadRate = Math.floor(Math.random() * 3000) + 1000;
        this.spreadChance = 30;
        this.id = id;
        this.properties = properties;
        this.population = population;
        this.hasPorts = hasPorts;
        this.game = game;
    }
    numHealthy(){
        return this.population - this.numInfected;
    }
    numAlive(){
        return this.population - this.numKilled;
    }

    tick(){
        this.airportTick();
    }
    startMortality(){

        this.mortalityInterval = setTimeout(() => {
            if (this.numAlive() === 0) {
                clearTimeout(this.mortalityInterval);
                return null
            }
            const mortChance = this.game.virus.mortalityChance();
            const possibleKills = Math.floor(Math.round((this.numInfected - this.numKilled) / mortChance) * 1.5)
            if (possibleKills + this.numKilled > this.numInfected){
                this.numKilled = this.numInfected
            } else if (possibleKills > 0){
                if (this.numKilled + possibleKills > this.population) {this.numKilled = this.population; clearTimeout(this.mortalityInterval); return null}
                this.numKilled += possibleKills;
            }
            if (this.numInfected > 0){
                this.game.map.updateChoropleth({
                    [this.id]: darkenHexColors('DD1C1A', Math.round( (this.numKilled / this.population) * 100))
                })
            }

            this.startMortality();
        }, this.game.virus.mortalityRate())
    }
    airportTick(){
        if (!this.airports) return null;
        const gameCountryKeys = Object.keys(this.game.countries);
        const interval = setInterval(() => {

            let selfRandomAirportIndex = Math.floor(Math.random() * this.airports.length);
            const ownAirport = this.airports[selfRandomAirportIndex];

            if (ownAirport.closed) clearInterval(interval);

            let randomCountryIndex = Math.floor(Math.random() * gameCountryKeys.length);
            while (this.game.countries[gameCountryKeys[randomCountryIndex]] === this || !this.game.countries[gameCountryKeys[randomCountryIndex]].airports) randomCountryIndex = Math.floor(Math.random() * gameCountryKeys.length);

            const randomCountry = this.game.countries[gameCountryKeys[randomCountryIndex]];
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

            if (this.infected){
                ownAirport.infect(randomCountry);
            }
            setTimeout(() => {
                this.game.arcs.splice(0,1);
                this.game.map.arc(this.game.arcs);
            }, 500);

        }, Math.floor(Math.random() * 100000) + 10000)
    }
    startSpread(){
        this.infected = true;
        const callback = () => {
            const timeout = setTimeout(callback, Math.round(this.spreadRate / 10) );
            const max = Math.floor(this.numHealthy() / 1000) + 10;
            if (this.spreadRate === 0 || this.numInfected === this.population) {
                clearTimeout(timeout);
                return null;
            }
            let count = 0;
            count = Math.round((100 / this.spreadChance) * this.numInfected);
            if (count > max) count = max;
            if (this.numInfected + count >= this.population){
                this.numInfected = this.population
            } else {
                this.numInfected += count;
            }
            if (this.game.numInfected() > this.game.totalPop() / 5 && !this.game.eventsStarted) this.game.startEvents();

        }
        callback();
    }
}