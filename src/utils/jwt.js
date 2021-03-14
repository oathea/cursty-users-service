const jwt = require('jsonwebtoken');

exports.makeJwt = (user) => {
    const data = {
        userID: user.id,
    };

    const token = jwt.sign({ data }, process.env.JWT_SECRET, {
        expiresIn: '100d',
    });

    return token;
};
