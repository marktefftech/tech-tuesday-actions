// There are three ways this script can finish:
// 1. The user's email/verified was updated successfully:
//    callback(null, true);
// 2. The user's email/verified was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changeEmail(email, newEmail, verified, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    region: configuration.AWS_REGION,
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const updateUser = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: newEmail },
          { Name: 'email_verified', Value: `${verified}` }
        ]
      };
      provider.adminUpdateUserAttributes(params, (err, data) =>
        err ? reject(err) : resolve(data)
      );
    });

  try {
    await updateUser();
    callback(null, true);
  } catch (err) {
    callback(new Error(err.message));
  }
}
