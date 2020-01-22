// IMPORTS
const express = require('express');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('store.json');
const database = lowdb(adapter);
const app = express();
const PORT = process.env.PORT || 6000;

// MODULE IMPORTS
const Product = require('./modules/Product');
const Customer = require('./modules/Customer');

// INIT DATABASE
const databaseInit = () => {
    const initDatabase = database.has('store').value();
    if (!initDatabase) {
        database.defaults({ store: [{ customers: [], products: [] }] }).write();
    }
};

// FUNCTIONS
const createURL = search => {
    return `<img src="http://placeimg.com/640/480/${search}">`;
};

const createProduct = async (name, price) => {
    let imgURL = createURL(name);
    let product = new Product(name, price, imgURL);
    const response = await database
        .get('store[0].products')
        .push(product)
        .write();
    return response;
};
const createCustomer = async name => {};

// ROUTES
app.get('/', (req, res) => {
    res.send('HELLO');
});

app.post('/products', async (req, res) => {
    let name = req.query.name;
    let price = req.query.price;

    let data = await createProduct(name, price);
    res.send(data);
});

// LISTEN TO SERVER
app.listen(PORT, () => {
    console.log(`Port open at ${PORT}...`);
    databaseInit();
});
