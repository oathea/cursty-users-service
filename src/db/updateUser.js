const { dynamodb } = require('./index');

module.exports = async function (id, { firstName, lastName }) {
    const now = new Date().getTime();

    var params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression:
            'set firstName = :firstName, lastName = :lastName, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
            ':firstName': firstName,
            ':lastName': lastName,
            ':updatedAt': now,
        },
    };

    await dynamodb.update(params).promise();
    return { id, firstName, lastName, updatedAt: now };
};
