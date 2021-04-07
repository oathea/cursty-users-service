const bcrypt = require('bcryptjs');

const getUserByEmail = require('../db/getUserByEmail');
const { badRequestResponse, okResponse } = require('../utils/api');
const { makeJwtFromUser, permissions } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');

async function login(event, context) {
    try {
        const { email, password } = event.body;

        const user = await getUserByEmail(email);
        const isValid = user && await bcrypt.compare(password, user.password);

        if (!isValid) {
            return badRequestResponse('Invalid credentials.');
        }

        const jwtData = {
            userID: user.id,
            permissions: permissions.USER,
        };

        const token = makeJwtFromUser(jwtData);
        return okResponse({ token });
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(login);
