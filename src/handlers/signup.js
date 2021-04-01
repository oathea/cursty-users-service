const createUser = require('../db/createUser');
const { conflictResponse, okResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function signup(event, context) {
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return conflictResponse('User already exists.');
        }

        const user = await createUser(event.body);
        const { id, email, firstName, lastName, createdAt, updatedAt } = user;

        return okResponse({
            id,
            email,
            firstName,
            lastName,
            createdAt,
            updatedAt,
        });
    } catch (err) {
        console.log({ err });
        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(signup);
