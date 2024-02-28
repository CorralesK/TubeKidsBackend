const User = require("../Models/UserModel");
const crypto = require('crypto');

/**
 * Function for encrypting a password using SHA-256
 * 
 * @param {string} password  - The plain text password to be encrypted.
 */
const EncryptPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Function to verify if the user is of legal age.
 * @param {string} dateString - Date of birth in format "YYYY-MM-DD".
 * @returns {boolean} - True if the user is of legal age, false otherwise.
 */
const IsOfLegalAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);

    if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid date of birth');
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
       age--;
    }
    
    return age >= 18;
};

/**
 * Create a new user (main account) in the database.
 * 
 * @param {*} req
 * @param {*} res
 */
const UserPost = async (req, res) => {
    try {
        if (!IsOfLegalAge(req.body.dateBirth)) {
            return res.status(401).json({ error: 'User is not of legal age.' });
        }

        const user = new User({
            email: req.body.email,
            password: EncryptPassword(req.body.password),
            pin: req.body.pin,
            name: req.body.name,
            lastName: req.body.lastName,
            country: req.body.country,
            dateBirth: req.body.dateBirth
        });

        const data = await user.save();
        res.header({ 'location': `/api/users/?id=${data.id}` });
        res.status(201).json(data);
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
const UserGet = async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ error: 'User does not exist' });
            }

            const hashedPassword = EncryptPassword(req.body.password);
            
            if (user.password !== hashedPassword) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            
            return res.status(200).json(user);
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
const UserPinGet = async (req, res) => {
    try {
        if (req.query && req.query._id) {
            const user = await User.findById(req.query._id);

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
    UserPost,
    UserGet,
    UserPinGet
}