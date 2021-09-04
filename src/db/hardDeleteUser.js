const { dynamodb } = require('./index');

async function hardDeleteUser(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
    };

    const res = await dynamodb.delete(params).promise();
    console.log({ res });
}

module.exports = hardDeleteUser;
