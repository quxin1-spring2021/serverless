console.log('Loading function');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });

exports.handler = async function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));

// var message = event.Records[0].Sns.Message;
// console.log('Message received from SNS:', message);
// callback(null, "Success");
var params = {
    Destination: {
      ToAddresses: ['enochquxin+test@gmail.com'],
    },
    Message: {
      Body: {
        Text: { Data: "Test" },
      },

      Subject: { Data: "Test Email" },
    },
    Source: "test@dev.chuhsin.me",
  };
  callback(null, "Success");
  return ses.sendEmail(params).promise()
};