const { dynamodb } = require('./index');

async function hardDeleteUser(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
    };

    await dynamodb.delete(params).promise();
}

module.exports = hardDeleteUser;
