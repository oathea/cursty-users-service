const createUser = require('../db/createUser');
const { useMiddleware } = require('../utils/middleware');

async function signUp(event, context) {
    try {
        const user = await createUser(event.body);
        const { id, email, firstName, lastName, createdAt, updatedAt } = user;

        return {
            statusCode: 200,
            body: JSON.stringify({
                id,
                email,
                firstName,
                lastName,
                createdAt,
                updatedAt,
            }),
        };
    } catch (err) {
        console.log({ err });

        return {
            statusCode: 500,
            body: JSON.stringify(err.message),
        };
    }
}

exports.handler = useMiddleware(signUp);
