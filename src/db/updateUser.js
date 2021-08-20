const { dynamodb } = require('./index');

module.exports = async function (id, { firstName, lastName, avatarS3Key }) {
    const now = new Date().getTime();

    var params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression:
            'set firstName = :firstName, lastName = :lastName, updatedAt = :updatedAt, avatarS3Key = :avatarS3Key',
        ExpressionAttributeValues: {
            ':firstName': firstName,
            ':lastName': lastName,
            ':updatedAt': now,
            ':avatarS3Key': avatarS3Key,
        },
    };

    await dynamodb.update(params).promise();
    return { id, firstName, lastName, avatarS3Key, updatedAt: now };
};
