const AWS = require('aws-sdk');
const getUserByEmail = require('../db/getUserByEmail');
const { conflictResponse, serverErrorResponse, okResponse } = require('../utils/api');
const { makeJwt } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');

const ses = new AWS.SES();

async function getSignupToken(event) {
    try {
        const { email } = event.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return conflictResponse('User already exists.');
        }

        const token = makeJwt({ email } , '10d');
        const req = makeMessage(email, token);

        await ses.sendEmail(req).promise();
        return okResponse('Success!');
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(getSignupToken);

function makeMessage(email, token) {
    const params = {
        Source: process.env.SENDER_EMAIL,
        Destination: {
            ToAddresses: [ email ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
<p><strong>Signup.</strong></p>
<a target='_blank' href='${[process.env.CLIENT_URL]}/onboarding?signupToken=${token}'>
    Click here to sign up
</a>
`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your Curtsy signup',
            },
        },
    };

    return params;
}