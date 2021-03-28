const createError = require('http-errors');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const jwt = require('jsonwebtoken');

module.exports.useMiddleware = function (handler) {
    return middy(handler).use(jsonBodyParser()).use(decodeJwt());
};

const decodeJwt = () => ({
    before: (handler, next) => {
        const headers = handler.event.headers;
        if (
            headers &&
            headers.Authorization &&
            headers.Authorization.includes('Bearer')
        ) {
            try {
                const token = headers.Authorization.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                handler.context.jwtData = decoded;
            } catch (error) {
                throw new createError.UnprocessableEntity(
                    'Could not decode JWT.'
                );
            }
        }

        next();
    },
});
