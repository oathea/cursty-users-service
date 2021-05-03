const createUser = require('../db/createUser');
const getUserByEmail = require('../db/getUserByEmail');
const { conflictResponse, okResponse, serverErrorResponse } = require('../utils/api');
const { permissions, makeJwt } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');

async function signup(event, context) {
    try {
        const signupEmail = context.jwtData.data.email;
        const existingUser = await getUserByEmail(signupEmail);
        if (existingUser) {
            return conflictResponse('User already exists.');
        }

        const user = await createUser({ ...event.body, email: signupEmail });
        const jwtData = {
            userID: user.id,
            permission: permissions.USER,
        };

        const token = makeJwt(jwtData);
        return okResponse({ token });
    } catch (err) {
        console.log({ err });
        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(signup);
