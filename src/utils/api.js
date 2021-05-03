function makeResponse(statusCode, body = {}) {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN,
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
    };
}

function okResponse(body = {}) {
    return makeResponse(200, body);
}

function serverErrorResponse(message = '') {
    return makeResponse(500, message);
}

function badRequestResponse(message = '') {
    return makeResponse(400, message);
}

function conflictResponse(message = '') {
    return makeResponse(409, message);
}

module.exports = {
    makeResponse,
    okResponse,
    serverErrorResponse,
    badRequestResponse,
    conflictResponse,
};
