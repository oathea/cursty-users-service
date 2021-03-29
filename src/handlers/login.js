const bcrypt = require('bcryptjs');

const getUserByEmail = require('../db/getUserByEmail');
const { makeJwtFromUser } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');

async function login(event, context) {
    try {
        const { email, password } = event.body;

        const user = await getUserByEmail(email);
        const isValid = user && await bcrypt.compare(password, user.password);

        if (!isValid) {
            return {
                statusCode: 400,
                body: JSON.stringify('Invalid credentials.'),
            };
        }

        const token = makeJwtFromUser(user);
        return {
            statusCode: 200,
            body: JSON.stringify({ token }),
        };
    } catch (err) {
        console.log({ err });

        return {
            statusCode: 500,
            body: JSON.stringify(err.message),
        };
    }
}

exports.handler = useMiddleware(login);
