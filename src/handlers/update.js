const updateUser = require('../db/updateUser');
const { useMiddleware } = require('../utils/middleware');

async function update(event, context) {
    try {
        console.log({ event });
        console.log({ context });
        const id = event.pathParameters.userId;

        const data = await updateUser(id, event.body);
        const { firstName, lastName, updatedAt } = data;

        return {
            statusCode: 200,
            body: JSON.stringify({
                id,
                firstName,
                lastName,
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

exports.handler = useMiddleware(update);
