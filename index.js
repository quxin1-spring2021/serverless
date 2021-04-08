console.log('Loading function');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });
let account = process.env.ACCOUNT;

exports.handler = async function(event, context, callback) {
// console.log('Received event:', JSON.stringify(event, null, 4));

var sns = event.Records[0].Sns
var message = sns.Message;
console.log(sns)
var operation = sns.MessageAttributes.Operation.Value;
var email = sns.MessageAttributes.Email.Value;

console.log('Message received from SNS:', message);
// callback(null, "Success");
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// var params_db = {
//   TableName: 'messages',
//   Key: {
//     'KEY_NAME': {S: `${message.MessageID}`}
//   },
//   ProjectionExpression: 'ATTRIBUTE_NAME'
// };

// Call DynamoDB to read the item from the table
ddb.getItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Item);
  }
});

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