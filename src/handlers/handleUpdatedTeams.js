const AWS = require('aws-sdk');
const addTeam = require('../db/addTeam');
const removeTeam = require('../db/removeTeam');
const { teamRoles } = require('../utils/constants');
const { useMiddleware } = require('../utils/middleware');

const unmarshall = AWS.DynamoDB.Converter.unmarshall;

async function handleUpdatedTeams(event, context) {
    console.log('event :%j', event);
    console.log('context :%j', context);

    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            await handleInsert(record);
        }
        if (record.eventName === 'REMOVE') {
            console.log('unmarshalled record :%j', unmarshall(record));
            await handleRemove(record);
        }
    }
}

async function handleInsert(record) {
    try {
        const team = unmarshall(record.dynamodb.NewImage);
        const userId = team.createdByUserID;
        await addTeam(userId, team.name, team.id, teamRoles.OWNER);
    } catch (err) {
        console.log('handleInsert :%j', err);
    }
}

async function handleRemove(record) {
    try {
        const team = unmarshall(record.dynamodb.OldImage);
        for (const userDetails of Object.values(team.users)) {
            await removeTeam(userDetails.id, team.id);
        }
    } catch (err) {
        console.log('handleRemove :%j', err);
    }
}

exports.handler = useMiddleware(handleUpdatedTeams);
