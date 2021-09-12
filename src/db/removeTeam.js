const { dynamodb } = require('./index');

module.exports = async function (id, teamID) {
    const now = new Date().getTime();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'SET #updatedAt = :updatedAt REMOVE #teams.#teamID',
        ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
            '#teams': 'teams',
            '#teamID': teamID,
        },
        ExpressionAttributeValues: {
            ':updatedAt': now,
        },
        ReturnValues: 'UPDATED_NEW',
    };

    const updated = await dynamodb.update(params).promise();
    return updated;
};
