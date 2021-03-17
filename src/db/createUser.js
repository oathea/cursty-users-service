const bcrypt = require('bcryptjs');
const { v1: uuidv1 } = require('uuid');

const { dynamoDb } = require('./index');

async function createUser({ email, firstName, lastName, password }) {
    const hash = bcrypt.hashSync(password, 9);
    const now = new Date().getTime();
    const user = {
        id: uuidv1(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hash,
        createdAt: now,
        updatedAt: now,
    };

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: process.env.DYNAMODB_GSI_NAME,
        Item: user,
    };

    await dynamoDb.put(params).promise();
    return user;
}

module.exports = createUser;
