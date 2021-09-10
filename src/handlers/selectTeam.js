const getUser = require('../db/getUser');

const { badRequestResponse, okResponse, serverErrorResponse } = require('../utils/api');
const { makeJwt } = require('../utils/jwt');
const { useMiddleware } = require('../utils/middleware');

async function selectTeam(event, context) {
    try {
        const id = context.jwtData.data.userID;
        const { teamID } = event.pathParameters;

        const user = await getUser(id);
        const isValid = user.teams[teamID] !== undefined;

        if (!isValid) {
            return badRequestResponse('You are not a member of the selected team.');
        }

        const jwtData = {
            ...context.jwtData.data,
            selectedTeamID: teamID,
        };

        const token = makeJwt(jwtData);
        return okResponse({ token });
    } catch (err) {
        console.log({ err });

        return serverErrorResponse(err.message);
    }
}

exports.handler = useMiddleware(selectTeam);
