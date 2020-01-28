/* IMPORTS */
const express = require('express');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const uuid = require('uuid/v1');
const adapter = new FileSync('store.json');
const database = lowdb(adapter);
const app = express();
const PORT = process.env.PORT || 6000;

/* MODULE IMPORTS */
const Product = require('./modules/Product.js');
const Customer = require('./modules/Customer.js');
// const ID = require('./modules/ID');

// INIT DATABASE
const databaseInit = () => {
    const initDatabase = database.has('store').value();
    if (!initDatabase) {
        database.defaults({ store: { customers: [], products: [] } }).write();
    }
};

/* FUNCTIONS */
const createURL = search => {
    return `http://placeimg.com/640/480/${search}`;
};

const createProduct = async (name, price) => {
    let imgURL = createURL(name);
    let id = uuid();
    let product = new Product(id, name, price, imgURL);
    console.log(product);
    const response = await database
        .get('store.products')
        .push(product)
        .write();
    return response;
};

const getAllProducts = async () => {
    return await database.get('store.products').value();
};

const getProduct = async id => {
    return await database
        .get(`store.products`)
        .find({ _id: `${id}` })
        .value();
};

const createCustomer = async (name, email) => {
    let id = uuid();
    let customer = new Customer(id, name, email);
    console.log(customer);
    const response = await database
        .get('store.customers')
        .push(customer)
        .write();
    return response;
};

const getAllCustomers = async () => {
    return await database.get('store.customers').value();
};

const getCustomer = async id => {
    return await database
        .get(`store.customers`)
        .find({ id: `${id}` })
        .value();
};

/* ROUTES */
app.get('/', (req, res) => {
    res.send('WELCOME TO THE STORE');
});

// Create a product
app.post('/products', async (req, res) => {
    let name = req.query.name;
    let price = req.query.price;

    let data = await createProduct(name, price);
    res.send(data);
});

// Get all products
app.get('/products', async (req, res) => {
    let data = await getAllProducts();
    res.send(data);
});

// get single product
app.get('/products/:id', async (req, res) => {
    let i = req.params.id;
    let data = await getProduct(i);
    res.send(data);
});

// Create a customer
app.post('/customers', async (req, res) => {
    let name = req.query.name;
    let email = req.query.email;

    let data = await createCustomer(name, email);
    res.send(data);
});

// Get all customers
app.get('/customers', async (req, res) => {
    let data = await getAllCustomers();
    res.send(data);
});

// get single customer
app.get('/customers/:id', async (req, res) => {
    let i = req.params.id;
    console.log(i);
    let data = await getCustomer(i);

    res.send(data);
});

/* LISTEN TO SERVER */
app.listen(PORT, () => {
    console.log(`Port open at ${PORT}...`);
    databaseInit();
});
