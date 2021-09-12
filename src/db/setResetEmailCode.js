const { dynamodb } = require('./index');
const randomWords = require('random-words');

module.exports = async function (id, email) {
    const now = new Date().getTime();
    const expiresAt = now + 5 * 60000;
    const code = randomWords({ exactly: 3, maxLength: 4, join: '-' });
    const resetEmailCode = { email, code, expiresAt };

    var params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set #updatedAt = :updatedAt, #resetEmailCode = :resetEmailCode',
        ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#resetEmailCode': 'resetEmailCode',
        },
        ExpressionAttributeValues: {
            ':updatedAt': now,
            ':resetEmailCode': resetEmailCode,
        },
    };

    await dynamodb.update(params).promise();
    return resetEmailCode;
};
