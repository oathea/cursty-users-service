const AWS = require('aws-sdk');

module.exports.dynamodb = new AWS.DynamoDB.DocumentClient();
