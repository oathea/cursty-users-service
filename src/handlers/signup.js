const createUser = require('../db/createUser');
const getUserByEmail = require('../db/getUserByEmail');
const { conflictResponse, okResponse, serverErrorResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function signup(event, context) {
    try {
        const signupEmail = context.jwtData.data.email;
        const existingUser = await getUserByEmail(signupEmail);
        if (existingUser) {
            return conflictResponse('User already exists.');
        }

        const user = await createUser({ ...event.body, email: signupEmail });
        const { id, email, firstName, lastName, avatarS3Key, createdAt, updatedAt } = user;

        return okResponse({
            id,
            email,
            firstName,
            lastName,
            avatarS3Key,
            createdAt,
            updatedAt,
        });
    } catch (err) {
        console.log({ err });
        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(signup);
