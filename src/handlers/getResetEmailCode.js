const getUser = require('../db/getUser');
const setResetEmailCode = require('../db/setResetEmailCode');
const { okResponse, serverErrorResponse, badRequestResponse } = require('../utils/api');
const { emailTypes } = require('../utils/constants');
const { useMiddleware } = require('../utils/middleware');
const { sendEmailQueueMessage } = require('../utils/sqs');

async function getResetEmailCode(event, context) {
    try {
        const id = context.jwtData.data.userID;
        const { email } = event.body;

        const user = await getUser(id);
        if (user.email === email) {
            return badRequestResponse('Email has not changed.');
        }

        const { code } = await setResetEmailCode(id, email);

        await sendEmailQueueMessage({ type: emailTypes.RESET_EMAIL_CODE, email, code });
        return okResponse();
    } catch (err) {
        console.log('error :%j', err);

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(getResetEmailCode);
