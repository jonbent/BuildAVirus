module.exports = class Airport {
    constructor({lat, lon, country, name, game}) {
        this.lat = lat;
        this.long = lon;
        this.country = country;
        this.name = name;
        this.game = game;
        this.closed = false;
        // if (!game) console.log('cant find game')
    }
    infect(country){
        // console.log(this.country)
        const numInfected = (Math.floor(((this.country.numInfected - this.country.numKilled) / this.country.population) * 100) + 1);
        if (this.game.infectCountry(country, this.country, numInfected)) {
            this.game.board.generateBubble({event: {title: `${country.properties.name} has been infected`, description: "Guess somebody forgot to get their vaccines before they got on a plane "}, location: country})
            this.game.map.updateChoropleth({
                [country.id]: 'red'
            });
                country.startSpread();
            }

    }

}