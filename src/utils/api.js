module.exports.okResponse = function (body = {}) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN,
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
    };
};
