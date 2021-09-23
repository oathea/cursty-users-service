const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

exports.makeJwt = (data = {}, expiresIn = '100d') => {
    const token = jwt.sign({ data }, jwtSecret, {
        expiresIn,
    });

    return token;
};

exports.makeUserJwt = (user, selectedTeamID) => {
    const teamIDs = Object.keys(user.teams);

    const data = {
        userID: user.id,
        email: user.email,
        permission: this.permissions.USER,
        selectedTeamID: selectedTeamID || teamIDs[0],
    };

    const token = jwt.sign({ data }, jwtSecret, {
        expiresIn: '100d',
    });

    return token;
};

exports.permissions = {
    SIGNUP: 'SIGNUP',
    RESET_PASSWORD: 'RESET_PASSWORD',
    USER: 'USER',
};
