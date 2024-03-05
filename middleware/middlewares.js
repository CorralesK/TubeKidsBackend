
/**
 * Middleware to validate an email address in req.body.
 */
const validateEmail = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        if (!emailRegex.test(req.body.email)) {
            throw new Error('Invalid email address');
        }
        next();
    } catch (error) {
        return res.status(400).json({ error: error.message || 'Email validation error' });
    }
};


/**
 * Middleware to verify if the user is of legal age based on date of birth in req.body.
 */
const validateLegalAge = (req, res, next) => {
    const today = new Date();
    const birthDate = new Date(req.body.dateOfBirth);

    if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format for dateOfBirth' });
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        return res.status(403).json({ error: 'User is not of legal age' });
    }
    next();
}

/**
 * Middleware to check if a given value in req.body is a 6-digit number.
 */
const validateSixDigitNumber = (req, res, next) => {
    if (!(/^\d{6}$/.test(req.body.pin))) {
        return res.status(400).json({ error: `Invalid value for pin. Must be a 6-digit number` });
    }
    next();
}

/**
 * Middleware to check if a given value in req.body is a valid video URL.
 * 
 * @param {string} field - The field name in req.body to be validated.
 * @returns {Function} Middleware function.
 */
const validateVideoUrl = (req, res, next) => {
    const urlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}$/;
    if (!urlRegex.test(req.body.url)) {
        return res.status(400).json({ error: `Invalid value for url. Must be a valid video URL` });
    }
    next();
}

module.exports = {
    validateEmail,
    validateLegalAge,
    validateSixDigitNumber,
    validateVideoUrl
};