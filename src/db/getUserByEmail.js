const { dynamoDb } = require('./index');

async function getUserByEmail(email) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: process.env.DYNAMODB_GSI_NAME,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
    };

    const { Items } = await dynamoDb.query(params).promise();
    return Items[0];
}

module.exports = getUserByEmail;
