const getUser = require('./getUser');
const hardDeleteUser = require('./hardDeleteUser');
const { dynamodb } = require('./index');

async function updateEmail(id, email) {
    const now = new Date().getTime();

    // -> removing resetEmailCode from user object.
    //eslint-disable-next-line
    const { resetEmailCode, ...user } = await getUser(id);
    const item = { ...user, email, updatedAt: now };

    try {
        await hardDeleteUser(id);
    } catch (err) {
        console.log('Failed to delete user');
        throw err;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: process.env.DYNAMODB_GSI_NAME,
        Item: item,
    };

    try {
        await dynamodb.put(params).promise();
    } catch (err) {
        console.log('Failed to create user');
        throw err;
    }

    return item;
}

module.exports = updateEmail;
