
module.exports = class Virus {
  constructor({name, game}) {
      this.name = name;
      this.game = game;
      this.cureRate = 0;
      this.abilities = {
          bird: 0,
          mosquito: 0,
          contact: 0,
          congestion: 0
      };
      this.fatalities = {
          finger: 0,
          cancer: 0
      };
      this.abilityTimeouts = {};
      this.fatalityTimeouts = {};
  }

  getUpgradeCost(type){
      return (this.abilities[type] * 200) + 100
  }
  getFatalityCost(type){
      return (this.fatalities[type] * 200) + 100
  }
  mortalityChance(){
      return Object.values(this.fatalities).reduce((acc, el) => acc + el) * 5;
  }
  mortalityRate(){
      return 10000 / Object.values(this.fatalities).reduce((acc, el) => acc + el)
  }

  upgradeFatality(type){
      this.fatalities[type] += 1;
      this.game.countryKeys.forEach(key => {
          this.game.countries[key].startMortality();
      })

  }

  upgradeAbility(type){
      if (this.abilityTimeouts[type]) clearTimeout(this.abilityTimeouts[type]);
      this.abilities[type] += 1;
      const timeoutFunction = ( ) => {
          const randomCountryName = this.game.countryKeys[Math.floor(Math.random() * this.game.countryKeys.length)];
          const secondRandomCountryName = this.game.countryKeys[Math.floor(Math.random() * this.game.countryKeys.length)];
          if (this.game.infectCountry(this.game.countries[randomCountryName], this.game.countries[secondRandomCountryName]) && this.game.countries[randomCountryName].infected === false) {
              this.game.map.updateChoropleth({
                    [this.game.countries[randomCountryName].id]: 'red'
              });
              this.game.countries[randomCountryName].startSpread();
              this.game.board.generateBubble({event: {title: `${this.game.countries[randomCountryName].properties.name} has been infected`, description: `${this.name} was just found in turkey due to a bird! sucks`}, location: this.game.countries[randomCountryName]});
          }

          const abilityTimeout = setTimeout(() => {
              this.abilityTimeouts[type] = abilityTimeout;
              timeoutFunction()
            // this.game.infectCountry()
          }, (Math.floor(Math.random() * 500) / this.abilities[type]) + 20)
          // }, 20)
      };
    timeoutFunction();
  }



  // increaseSpreadRate(name, amount){
  //     if (!this.spreadRates[name]) throw "Ability name does not exist";
  //     this.spreadRates[name] += amount;
  // }

};