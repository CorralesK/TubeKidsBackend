const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Scheme for profiles (restricted users)
 */
const profile = new Schema({
    name: { type: String, required: true },
    pin: { type: Number, required: true },
    avatar: { type: String, required: true },
    age: { type: Number },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Profile', profile);