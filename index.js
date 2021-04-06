console.log('Loading function');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });

exports.handler = async function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));

var sns = event.Records[0].Sns
var message = sns.Message;
var operation = sns.Message.Operation;
var Operation = sns.Operation;
var Email = sns.Email;
var email = sns.Message.Email;
console.log("Email" + Email);
console.log("email" + email);
console.log('Message received from SNS:', message);
// callback(null, "Success");

var params = {
    Destination: {
      ToAddresses: [Email],
    },
    Message: {
      Body: {
        Text: { Data: `${message}` },
      },

      Subject: { Data: `Notification for ${operation} A Book Under Your Username` },
    },
    Source: "test@dev.chuhsin.me",
  };
  callback(null, "Success");
  return ses.sendEmail(params).promise()
};