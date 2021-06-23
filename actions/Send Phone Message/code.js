/**
 * Handler that will be called during the execution of a SendPhoneMessage flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 */
exports.onExecuteSendPhoneMessage = async (event) => {
  const AWS = require('aws-sdk');

  const text = event.message_options.text;
  const recipient = event.message_options.recipient;

  const awsSNS = new AWS.SNS({
    apiVersion: '2010-03-31',
    region: event.secrets.AWS_REGION,
    credentials: new AWS.Credentials(
      event.secrets.AWS_ACCESS_KEY_ID,
      event.secrets.AWS_SECRET_ACCESS_KEY
    )
  });

  const params = { Message: text, PhoneNumber: recipient };

  return awsSNS.publish(params).promise();
};
