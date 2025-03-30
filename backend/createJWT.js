const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createToken = function(firstName, lastName, userId) {
    // Standardize payload for Flutter compatibility
    const payload = { 
        userId: userId.toString(), // Ensure string type
        firstName: firstName || '',
        lastName: lastName || ''
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.isExpired = function(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return false;
    } catch (e) {
        return true;
    }
};

exports.refresh = function(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        // Maintain consistent payload structure
        return jwt.sign(
            { 
                userId: decoded.userId, 
                firstName: decoded.firstName, 
                lastName: decoded.lastName 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
    } catch (e) {
        return "";
    }
};