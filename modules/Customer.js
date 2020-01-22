const ID = require('./ID');
class Customer {
    constructor(name) {
        (id = ID.idGen()), (this.name = name), (basket = []);
    }
}

module.exports = { Customer };
