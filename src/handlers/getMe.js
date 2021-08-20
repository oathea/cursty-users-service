const getUser = require('../db/getUser');
const { okResponse, serverErrorResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function get(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const data = await getUser(id);
        const { avatarS3Key, firstName, lastName, updatedAt, createdAt, email, teams } = data;

        return okResponse({
            id,
            firstName,
            lastName,
            updatedAt,
            createdAt,
            email,
            teams,
            avatarS3Key,
        });
    } catch (err) {
        console.log('error getting user :%j', err);
        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(get);
