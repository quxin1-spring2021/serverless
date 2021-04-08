console.log('Loading function');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-west-2" });
let account = process.env.ACCOUNT;

exports.handler = async function (event, context, callback) {
  // console.log('Received event:', JSON.stringify(event, null, 4));

  var sns = event.Records[0].Sns
  var message = sns.Message;
  console.log(sns)
  var operation = sns.MessageAttributes.Operation.Value;
  var email = sns.MessageAttributes.Email.Value;
  var bookid = sns.MessageAttributes.BookId.Value;

  console.log('Message received from SNS:', message);
  // callback(null, "Success");
  var ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });

  var params_db_get = {
    TableName: 'messages',
    Key: {
      'MessageID': { S: `${sns.MessageId}` }
    },
  };

  // Call DynamoDB to read the item from the table
  var messageId = ddb.getItem(params_db_get, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });

  if (messageId.length !== 0) {
    console.log("This Message Already Existed.")
    return;
  } else {

    // If message ID doesn't exist, put new message id into dynamoDB

    var params_db_put = {
      TableName: 'messages',
      Item: {
        'MessageID': { S: `${sns.MessageId}` },
        'BookID': { S: `${bookid}` },
        'Operation': { S: 'Create' }
      }
    };
    ddb.putItem(params_db_put, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
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
  }
};