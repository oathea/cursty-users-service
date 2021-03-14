const AWS = require('aws-sdk');

module.exports.dynamoDb = new AWS.DynamoDB.DocumentClient();
