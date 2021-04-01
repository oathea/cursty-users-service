const updateUser = require('../db/updateUser');
const { okResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function update(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const data = await updateUser(id, event.body);
        const { firstName, lastName, updatedAt } = data;

        return okResponse({
            id,
            firstName,
            lastName,
            updatedAt,
        });
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(update);
