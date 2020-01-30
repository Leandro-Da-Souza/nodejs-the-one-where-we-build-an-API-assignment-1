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

const updateProduct = async (id, newName, newPrice) => {
    let newProd = await database
        .get('store.products')
        .find({ _id: id })
        .assign(
            { name: newName },
            { price: newPrice },
            { img: createURL(newName) }
        )
        .write();

    return newProd;
};

const deleteProduct = async id => {
    let deletedProd = await database
        .get('store.products')
        .remove({ _id: id })
        .write();
    return deletedProd;
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

const updateCustomer = async (id, newName, newEmail) => {
    let newCust = await database
        .get('store.customers')
        .find({ id: id })
        .assign({ name: newName }, { email: newEmail })
        .write();
    return newCust;
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

const deleteCustomer = async id => {
    let deletedCust = await database
        .get('store.customers')
        .remove({ id: id })
        .write();
    return deletedCust;
};

/* ROUTES */
app.get('/', async (req, res) => {});

// update a product
app.put('/products/:id', async (req, res) => {
    let data = await updateProduct(
        req.params.id,
        req.query.newName,
        req.query.newPrice
    );
    res.send(data);
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

// delete a product
app.delete('/products/:id', async (req, res) => {
    let data = await deleteProduct(req.params.id);
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

app.put('/customers/:id', async (req, res) => {
    let data = await updateCustomer(
        req.params.id,
        req.query.newName,
        req.query.newEmail
    );

    res.send(data);
});

app.delete('/customers/:id', async (req, res) => {
    let data = await deleteCustomer(req.params.id);
    res.send(data);
});

/**
 * Assignment Routes And Functionality
 */

const addToBasket = async (custID, prodID) => {
    let customer = await getCustomer(custID);
    let product = await getProduct(prodID);
    if (!product) {
        return 'No such product found';
    }
    let basket = await database
        .get(`store.customers`)
        .find({ id: custID })
        .get('basket')
        .value();
    let test = basket.find(prod => prod._id === prodID);
    if (test === undefined) {
        basket.push(product);
        console.log(product);
        console.log(basket);
        console.log(basket.includes(product) === false);
        return await database
            .get('store.customers')
            .find({ id: custID })
            .assign({ basket })
            .write();
    } else {
        return `I'm Afraid I Cant Let You Do That ${customer.name}`;
    }
};

app.post('/addToBasket', async (req, res) => {
    let customerID = req.query.customerID;
    let productID = req.query.productID;
    let data = await addToBasket(customerID, productID);
    res.send(data);
});

const deleteFromBasket = async (custID, prodID) => {
    let customer = await getCustomer(custID);
    let product = await getProduct(prodID);
    if (!product) {
        return 'No such product found';
    }
    let basket = await database
        .get('store.customers')
        .find({ id: custID })
        .get('basket')
        .value();
    basket.splice(basket.indexOf(product), 1);
    return await database
        .get('store.customers')
        .find({ id: custID })
        .assign({ basket })
        .write();
};

app.delete('/deleteFromBasket', async (req, res) => {
    let data = await deleteFromBasket(
        req.query.customerID,
        req.query.productID
    );
    res.send(data);
});

const getBasket = async custID => {
    return await database
        .get('store.customers')
        .find({ id: custID })
        .get('basket')
        .value();
};

app.get('/getBasket', async (req, res) => {
    let data = await getBasket(req.query.customerID);
    res.send(data);
});

/* LISTEN TO SERVER */
app.listen(PORT, () => {
    console.log(`Port open at ${PORT}...`);
    databaseInit();
});
