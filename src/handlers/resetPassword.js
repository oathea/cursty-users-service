const bcrypt = require('bcryptjs');

const getUser = require('../db/getUser');
const updatePassword = require('../db/updatePassword');
const { okResponse, serverErrorResponse, badRequestResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function resetPassword(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const { oldPassword, newPassword } = event.body;
        const user = await getUser(id);
        const isValid = user && (await bcrypt.compare(oldPassword, user.password));

        if (!isValid) {
            return badRequestResponse('Invalid credentials.');
        }

        const data = await updatePassword(id, newPassword);
        const { updatedAt } = data;

        return okResponse({
            id,
            updatedAt,
        });
    } catch (err) {
        console.log('error :%j', err);

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(resetPassword);
