const AWS = require('aws-sdk');
const addTeam = require('../db/addTeam');
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
    }
}

async function handleInsert(record) {
    try {
        const team = unmarshall(record.dynamodb.NewImage);
        const userId = team.createdByUserID;
        await addTeam(userId, team.name, team.id, teamRoles.OWNER);
    } catch (err) {
        console.log('error :%j', err);
    }
}

exports.handler = useMiddleware(handleUpdatedTeams);
