const createError = require('http-errors');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const jwt_decode = require('jwt-decode');

module.exports.useMiddleware = function (handler) {
    return middy(handler).use(jsonBodyParser()).use(decodeJwt());
};

const decodeJwt = () => ({
    before: (handler, next) => {
        const headers = handler.event.headers;
        if (
            headers &&
            headers.Authorization &&
            headers.Authorization.includes('Bearer') &&
            headers.Authorization.replace('Bearer ', '')
        ) {
            try {
                const token = headers.Authorization.replace('Bearer ', '');
                handler.context.jwtData = jwt_decode(token);
            } catch (error) {
                throw new createError.UnprocessableEntity(
                    'Could not decode JWT.'
                );
            }
        }

        next();
    },
});
