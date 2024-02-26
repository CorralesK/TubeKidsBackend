require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./Routes/Routes.js');

// database connection
const mongoose = require('mongoose');
const MongoString = process.env.DATABASE_URL;

mongoose.connect(MongoString);
const DataBase = mongoose.connection;

DataBase.on('error', (error) => { console.log(error); })

DataBase.once('connected', () => { console.log('Database Connected'); })

/**
 *  Parser for the request body (required for the POST and PUT methods)
 */
const BodyParser = require("body-parser");
app.use(BodyParser.json());

/**
 * Set server port
 */
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

/**
 * Use routes file
 */
app.use('/api', routes);