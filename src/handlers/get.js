const getUser = require('../db/getUser');
const { useMiddleware } = require('../utils/middleware');

async function get(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const data = await getUser(id);
        const { firstName, lastName, updatedAt, createdAt, email } = data;

        return {
            statusCode: 200,
            body: JSON.stringify({
                id,
                firstName,
                lastName,
                updatedAt,
                createdAt,
                email,
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

exports.handler = useMiddleware(get);
