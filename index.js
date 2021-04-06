console.log('Loading function');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });
let account = process.env.ACCOUNT;

exports.handler = async function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));

var sns = event.Records[0].Sns
var message = sns.Message;
var operation = sns.MessageAttributes.Operation.Value;
var email = sns.MessageAttributes.Email.Value;

console.log('Message received from SNS:', message);
// callback(null, "Success");

var params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: `${message}` },
      },

      Subject: { Data: `Notification for ${operation} A Book Under Your Username` },
    },
    Source: `notification@${account}.chuhsin.me`,
  };
  callback(null, "Success");
  return ses.sendEmail(params).promise()
};