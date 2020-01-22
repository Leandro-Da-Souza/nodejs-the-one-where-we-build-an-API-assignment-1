const express = require('express');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('store.json');
const database = lowdb(adapter);
const app = express();
const PORT = process.env.PORT || 8080;

// INIT DATABASE
const databaseInit = () => {
    const initDatabase = database.has('store').value();
    if (!initDatabase) {
        database.defaults({ store: [] }).write();
    }
};

// LISTEN TO SERVER
app.listen(PORT, () => {
    console.log(`Port open at ${PORT}...`);
    databaseInit();
});
