const Virus = require('../Virus');

module.exports = class BlackPlague extends Virus {
    constructor(props) {
        super({...props, name: "The Black Plague"})

    }
}