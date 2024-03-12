require('dotenv').config();
const User = require("../models/userModel");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Function for encrypting a password using SHA-256
 * 
 * @param {string} password  - The plain text password to be encrypted.
 */
const encryptPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Function to create a JWT token containing only essential user information.
 * 
 * @param {Object} user - User object containing relevant data.
 * @returns {string} - A JSON Web Token.
 */
function createToken(user) {
    const secretKey = process.env.SECRET_KEY;
  
    const tokenData = {
      id: user._id,
      email: user.email,
      password: user.password,
      pin: user.pin
    };
  
    const token = jwt.sign(tokenData, secretKey, { expiresIn: '12h' });
    return token;
  }
  

/**
 * Create a new user (main account) in the database.
 * 
 * @param {*} req
 * @param {*} res
 */
const userPost = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: encryptPassword(req.body.password),
            pin: req.body.pin,
            name: req.body.name,
            lastName: req.body.lastName,
            country: req.body.country,
            dateBirth: req.body.dateOfBirth
        });

        const data = await user.save();

        const token = createToken(data);

        res.header({ 'location': `/api/users/?id=${data.id}` });
        res.status(201).json(token);
    } catch (error) {
        console.error('Error while saving the user:', error);
        res.status(422).json({ error: 'There was an error saving the user' });
    }
}

/**
 * Method to verify user's credentials.
 * Get a user (main account) if the email and password match with any on the DB.
 *
 * @param {*} req
 * @param {*} res
 */
const userGet = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ error: 'User does not exist' });
            }

            const hashedPassword = encryptPassword(req.body.password);

            if (user.password !== hashedPassword) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const token = createToken(user);

            res.header({ 'location': `/api/users/?id=${user.id}` });
            return res.status(200).json(token);
        } else {
            return res.status(400).json({ error: 'Invalid request: email and password required' });
        }
    } catch (error) {
        console.error('Error while querying users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Get a user (main account) pin 
 *
 * @param {*} req
 * @param {*} res
 */
const userPinGet = async (req, res) => {
    try {
        if (req.userId) {
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({ error: "User doesn't exist" });
            }

            if (user.pin != req.query.pin) {
                return res.status(401).json({ error: 'Incorrect pin' });
            }

            return res.status(200).json(user);
        } else {
            return res.status(400).json({ error: 'User ID is required' });
        }
    } catch (error) {
        console.error('Error while getting user pin:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    userPost,
    userGet,
    userPinGet
}