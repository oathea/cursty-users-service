const getUserByEmail = require('../db/getUserByEmail');
const { conflictResponse, serverErrorResponse, okResponse } = require('../utils/api');
const { emailTypes } = require('../utils/constants');
const { makeJwt, permissions } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');
const { sendEmailQueueMessage } = require('../utils/sqs');

async function getSignupToken(event) {
    try {
        const { email } = event.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return conflictResponse('User already exists.');
        }

        const tokenData = {
            email,
            permission: permissions.SIGNUP,
        };

        const token = makeJwt(tokenData, '10d');
        await sendEmailQueueMessage({ token, email, type: emailTypes.SIGNUP });

        return okResponse('Success!');
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(getSignupToken);
