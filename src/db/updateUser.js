const { dynamodb } = require('./index');

module.exports = async function (id, { name, avatarS3Key }) {
    const now = new Date().getTime();

    var params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set #updatedAt = :updatedAt, #name = :name, avatarS3Key = :avatarS3Key',
        ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':updatedAt': now,
            ':name': name,
            ':avatarS3Key': avatarS3Key,
        },
    };

    await dynamodb.update(params).promise();
    return { id, name, avatarS3Key, updatedAt: now };
};
