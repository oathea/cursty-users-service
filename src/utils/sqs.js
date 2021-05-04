// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Create SQS service client
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.sendEmailQueueMessage = body => {
    const params = {
        MessageBody: JSON.stringify(body),
        QueueUrl: process.env.EMAIL_QUEUE_URL,
    };

    return sqs.sendMessage(params).promise();
};
