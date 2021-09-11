const { dynamodb } = require('./index');

module.exports = async function (id, teamName, teamID, role) {
    const now = new Date().getTime();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set updatedAt = :updatedAt, teams.#teamID = :team',
        ExpressionAttributeNames: {
            '#teamID': teamID,
        },
        ExpressionAttributeValues: {
            ':updatedAt': now,
            ':team': { name: teamName, id: teamID, role },
        },
        ReturnValues: 'UPDATED_NEW',
    };

    const updated = await dynamodb.update(params).promise();
    return updated;
};
