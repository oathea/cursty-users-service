const AWS = require('aws-sdk');
const { isDifferent } = require('../utils/generic');
const putTeam = require('../db/putTeam');
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
        await putTeam(userId, team.name, team.id, teamRoles.OWNER);
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

        const members = Object.values(team.users);
        const prevMembers = Object.values(prevTeam.users);

        const newMembers = members.filter(m => !prevTeam.users[m.id]);
        for (const userDetails of newMembers) {
            await putTeam(userDetails.id, team.name, team.id, userDetails.role);
        }

        const removedMembers = prevMembers.filter(m => !team.users[m.id]);
        for (const userDetails of removedMembers) {
            await removeTeam(userDetails.id, team.id);
        }

        const existingMembers = members.filter(m => prevTeam.users[m.id]);
        for (const userDetails of existingMembers) {
            const prevUserDetails = prevTeam.users[userDetails.id];

            // only update if name/role have changed. Could cause infinite loop if we don't check this.
            if (isDifferent([team.name, userDetails.role], [prevTeam.name, prevUserDetails.role])) {
                await putTeam(userDetails.id, team.name, team.id, userDetails.role);
            }
        }
    } catch (err) {
        console.log('handleModify error :%j', err);
        console.log({ err });
    }
}

exports.handler = useMiddleware(handleUpdatedTeams);
