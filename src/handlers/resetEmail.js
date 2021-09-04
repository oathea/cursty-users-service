const getUser = require('../db/getUser');
const updateEmail = require('../db/updateEmail');
const { okResponse, serverErrorResponse, badRequestResponse } = require('../utils/api');
const { useMiddleware } = require('../utils/middleware');

async function resetEmail(event, context) {
    try {
        const id = context.jwtData.data.userID;

        const { code } = event.body;
        const { resetEmailCode } = await getUser(id);

        const now = new Date().getTime();

        if (!resetEmailCode || resetEmailCode.code !== code) {
            return badRequestResponse('The provided code is invalid.');
        }
        if (resetEmailCode.expiresAt < now) {
            return badRequestResponse('The provided code has expired.');
        }

        const { email } = await updateEmail(id, resetEmailCode.email);
        return okResponse({ email });
    } catch (err) {
        console.log('error :%j', err);

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(resetEmail);
