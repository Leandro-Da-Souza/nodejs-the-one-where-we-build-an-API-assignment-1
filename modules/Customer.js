module.exports = class Customer {
    constructor(id, name, email) {
        (this.id = id),
            (this.name = name),
            (this.email = email),
            (this.basket = []);
    }
};
