const bcrypt = require('bcryptjs');
const { dynamodb } = require('./index');

module.exports = async function (id, password) {
    const hash = bcrypt.hashSync(password, 9);
    const now = new Date().getTime();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set #updatedAt = :updatedAt, #password = :hash',
        ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#password': 'password',
        },
        ExpressionAttributeValues: {
            ':updatedAt': now,
            ':hash': hash,
        },
    };

    await dynamodb.update(params).promise();
    return { id, updatedAt: now };
};
