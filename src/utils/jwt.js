const jwt = require('jsonwebtoken');

exports.makeJwtFromUser = (user) => {
    const data = {
        userID: user.id,
    };

    const token = jwt.sign({ data }, process.env.JWT_SECRET, {
        expiresIn: '100d',
    });

    return token;
};

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