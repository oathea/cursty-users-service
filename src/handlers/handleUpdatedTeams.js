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
            await handleRemove(record);
        }
        if (record.eventName === 'MODIFY') {
            await handleModify(record);
        }
    }
}

async function handleInsert(record) {
    try {
        const team = unmarshall(record.dynamodb.NewImage);
        const userId = team.createdByUserID;
        await addTeam(userId, team.name, team.id, teamRoles.OWNER);
    } catch (err) {
        console.log('handleInsert error :%j', err);
    }
}

async function handleRemove(record) {
    try {
        const team = unmarshall(record.dynamodb.OldImage);
        for (const userDetails of Object.values(team.users)) {
            await removeTeam(userDetails.id, team.id);
        }
    } catch (err) {
        console.log('handleRemove error :%j', err);
    }
}

async function handleModify(record) {
    try {
        const team = unmarshall(record.dynamodb.NewImage);
        const prevTeam = unmarshall(record.dynamodb.OldImage);

        const newTeamMembers = Object.values(team.users).filter(
            member => !prevTeam.users[member.id],
        );

        for (const userDetails of newTeamMembers) {
            await addTeam(userDetails.id, team.name, team.id, userDetails.role);
        }

        const deletedTeamMembers = Object.values(prevTeam.users).filter(
            member => !team.users[member.id],
        );

        for (const userDetails of deletedTeamMembers) {
            await removeTeam(userDetails.id, team.id);
        }
    } catch (err) {
        console.log('handleModify error :%j', err);
    }
}

exports.handler = useMiddleware(handleUpdatedTeams);
