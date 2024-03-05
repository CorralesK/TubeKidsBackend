require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./routes/routes.js');

// database connection
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const dataBase = mongoose.connection;

dataBase.on('error', (error) => { console.log(error); })

dataBase.once('connected', () => { console.log('Database Connected'); })

/**
 *  Parser for the request body (required for the POST and PUT methods)
 */
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

/**
 * Use routes file
 */
app.use('/api', routes);

/**
 * Set server port
 */
app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})