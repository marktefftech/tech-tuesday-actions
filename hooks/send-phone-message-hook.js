// Load the SDK
var AWS = require('aws-sdk');

/**
@param {string} recipient - phone number
@param {string} text - message body
@param {object} context - additional authorization context
@param {string} context.factor_type - 'first' or 'second'
@param {string} context.message_type - 'sms' or 'voice'
@param {string} context.action - 'enrollment' or 'authentication'
@param {string} context.language - language used by login flow
@param {string} context.code - one time password
@param {string} context.ip - ip address
@param {string} context.user_agent - user agent making the authentication request
@param {string} context.client_id - to send different messages depending on the client id
@param {string} context.name - to include it in the SMS message
@param {object} context.client_metadata - metadata from client
@param {object} context.user - To customize messages for the user
@param {function} cb - function (error, response)
*/
module.exports = async (recipient, text, context, cb) => {
  const secrets = context.webtask.secrets;
  process.env.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY;
  process.env.AWS_REGION = secrets.AWS_REGION;

  const params = { Message: text, PhoneNumber: recipient };

  const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

  try {
    await sns.publish(params).promise();
    cb(null, {});
  } catch (err) {
    cb(err);
  }
};
