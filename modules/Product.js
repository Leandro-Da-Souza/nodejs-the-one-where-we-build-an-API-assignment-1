const ID = require('./ID');

function Product(name, price, img) {
    this.id = ID.idGen();
    this.name = name;
    this.price = price;
    this.img = img;
}

module.exports = { Product };

// class Product {
//     constructor(name, price, img) {
//         (id = ID.idGen()),
//             (this.name = name),
//             (this.price = price),
//             (this.img = img);
//     }
// }
