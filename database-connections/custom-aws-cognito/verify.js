// There are two ways this script can finish:
// 1. The user's email was verified successfully
//    callback(null, true);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function verify(email, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY,
    region: configuration.AWS_REGION
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const updateUser = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: email,
        UserAttributes: [{ Name: 'email_verified', Value: 'true' }]
      };
      provider.adminUpdateUserAttributes(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

  try {
    await updateUser();
    callback(null, true);
  } catch (err) {
    callback(new Error(err.message));
  }
}
