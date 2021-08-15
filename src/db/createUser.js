const bcrypt = require('bcryptjs');
const { v1: uuidv1 } = require('uuid');

const { dynamodb } = require('./index');

async function createUser({ email, firstName, lastName, avatarS3Key, password }) {
    const hash = bcrypt.hashSync(password, 9);
    const now = new Date().getTime();
    const user = {
        id: uuidv1(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        avatarS3Key: avatarS3Key,
        password: hash,
        createdAt: now,
        updatedAt: now,
        teams: {},
    };

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: process.env.DYNAMODB_GSI_NAME,
        Item: user,
    };

    await dynamodb.put(params).promise();
    return user;
}

module.exports = createUser;
