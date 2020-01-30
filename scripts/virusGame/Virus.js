
module.exports = class Virus {
  constructor({name, game}) {
      this.name = name;
      this.game = game;
      this.cureRate = 0;
      this.mortalityRate = 0;
      this.abilities = {
          bird: 0,
          mosquito: 0
      }
  }

  getUpgradeCost(type){
      return (this.abilities[type] * 200) + 100
  }

  upgradeAbility(type){
      if (this.abilities[type] === 0){
          setInterval(() => {
              const randomCountryName = this.game.countryKeys[Math.floor(Math.random() * this.game.countryKeys.length)];
              const secondRandomCountryName = this.game.countryKeys[Math.floor(Math.random() * this.game.countryKeys.length)];
              if (this.game.infectCountry(this.game.countries[randomCountryName], this.game.countries[secondRandomCountryName])) this.game.countries[randomCountryName].startSpread();
              this.game.board.generateBubble({event: {title: `${this.game.countries[secondRandomCountryName].properties.name} has been infected`, description: `${this.name} has started taking control of it's hosts`}, location: this.game.countries[secondRandomCountryName]});
            // this.game.infectCountry()
          }, 20)
      }
      this.abilities[type] += 1;
  }



  // increaseSpreadRate(name, amount){
  //     if (!this.spreadRates[name]) throw "Ability name does not exist";
  //     this.spreadRates[name] += amount;
  // }

};