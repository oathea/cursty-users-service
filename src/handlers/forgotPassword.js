const getUserByEmail = require('../db/getUserByEmail');
const { serverErrorResponse, okResponse, badRequestResponse } = require('../utils/api');
const { emailTypes } = require('../utils/constants');
const { makeJwt, permissions } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');
const { sendEmailQueueMessage } = require('../utils/sqs');

async function forgotPassword(event) {
    try {
        const { email } = event.body;

        const user = await getUserByEmail(email);
        if (!user) {
            return badRequestResponse('This email does not have an existing account.');
        }

        const tokenData = {
            userId: user.id,
            permission: permissions.RESET_PASSWORD,
        };

        const token = makeJwt(tokenData, '1d');
        await sendEmailQueueMessage({ token, email, type: emailTypes.RESET_PASSWORD });

        return okResponse('Success!');
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(forgotPassword);
