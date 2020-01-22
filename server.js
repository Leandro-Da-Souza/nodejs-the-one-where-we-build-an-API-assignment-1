// IMPORTS
const express = require('express');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('store.json');
const database = lowdb(adapter);
const app = express();
const PORT = process.env.PORT || 8080;

// MODULE IMPORTS
const Product = require('./modules/Product');
const Customer = require('./modules/Customer');
const ID = require('./modules/ID');

// INIT DATABASE
const databaseInit = () => {
    const initDatabase = database.has('store').value();
    if (!initDatabase) {
        database.defaults({ store: [{ customers: [], products: [] }] }).write();
    }
};

// FUNCTIONS

// ROUTES
app.get('/', (req, res) => {
    let randNum = ID.idGen();
    res.send(randNum.toString());
});

// LISTEN TO SERVER
app.listen(PORT, () => {
    console.log(`Port open at ${PORT}...`);
    databaseInit();
});
