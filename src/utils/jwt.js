const jwt = require('jsonwebtoken');

exports.makeJwt = (data = {}, expiresIn = '100d') => {
    const token = jwt.sign({ data }, process.env.JWT_SECRET, {
        expiresIn,
    });

    return token;
};

exports.permissions = {
    SIGNUP: 'SIGNUP',
    USER: 'USER',
};
