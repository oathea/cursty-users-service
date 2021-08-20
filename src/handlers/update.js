const updateUser = require('../db/updateUser');
const { okResponse, serverErrorResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function update(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const data = await updateUser(id, event.body);
        const { firstName, lastName, updatedAt, avatarS3Key } = data;

        return okResponse({
            firstName,
            lastName,
            updatedAt,
            avatarS3Key,
        });
    } catch (err) {
        console.log('error :%j', err);

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(update);
