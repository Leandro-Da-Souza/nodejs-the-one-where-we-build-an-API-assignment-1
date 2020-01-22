const ID = require('./ID');
class Product {
    constructor(name, price, img) {
        (id = ID.idGen()),
            (this.name = name),
            (this.price = price),
            (this.img = img);
    }
}

module.exports = { Product };
