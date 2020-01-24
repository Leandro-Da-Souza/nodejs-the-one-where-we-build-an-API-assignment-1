// const ID = require('./ID');

// function Product(id, name, price, img) {
//     this.id = id;
//     this.name = name;
//     this.price = price;
//     this.img = img;
// }

module.exports = class Product {
    constructor(name, price, img) {
        (this._id = Product.incrementId()),
            (this.name = name),
            (this.price = price),
            (this.img = img);
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1;
        else this.latestId++;
        return this.latestId++;
    }
};
// module.exports = { Product };

// class Product {
//     constructor(name, price, img) {
//         (id = ID.idGen()),
//             (this.name = name),
//             (this.price = price),
//             (this.img = img);
//     }
// }

// const Product = (function() {
//     let nextID = 0;
//     return function(name, price, img) {
//         (this.id = nextID++),
//             (this.name = name),
//             (this.price = price),
//             (this.img = img);
//     };
// })();
