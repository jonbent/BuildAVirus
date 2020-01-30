module.exports = class Airport {
    constructor({lat, lon, country, name, game}) {
        this.lat = lat;
        this.long = lon;
        this.country = country;
        this.name = name;
        this.game = game;
        this.closed = false;
        if (!game) console.log('cant find game')
    }
    infect(country){
        const numInfected = (Math.floor(this.game.numInfected(this.country) / this.game.totalPop(this.country) * 100));
        if (country.numInfected === numInfected) {
                this.game.board.generateBubble({event: {title: `${country.properties.name} has been infected`, description: "Guess somebody forgot to get their vaccines before they got on a plane "}, location: country})
                if (this.game.infectCountry(country, this.country, numInfected)) country.startSpread();
        }

    }

}