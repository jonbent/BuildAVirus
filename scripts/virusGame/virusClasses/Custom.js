const Virus = require('../Virus');

module.exports = (name) => class BlackPlague extends Virus {
    constructor(props) {
        super({...props, name})

    }
};