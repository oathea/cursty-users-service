const { dynamodb } = require('./index');

async function getUser(id) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id },
    };
    
    const { Item } = await dynamodb.get(params).promise();
    return Item;
}

module.exports = getUser;
