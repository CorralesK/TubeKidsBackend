const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Scheme for users
 */
const user = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    pin: { type: Number, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String },
    dateBirth: { type: Date, required: true }
});

module.exports = mongoose.model('User', user);