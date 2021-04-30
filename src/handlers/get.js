const getUser = require('../db/getUser');
const { okResponse, serverErrorResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function get(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const data = await getUser(id);
        const { firstName, lastName, updatedAt, createdAt, email } = data;

        return okResponse({
            id,
            firstName,
            lastName,
            updatedAt,
            createdAt,
            email,
        });
    } catch (err) {
        console.log({ err });
        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(get);
