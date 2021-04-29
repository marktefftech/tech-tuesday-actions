// There are three ways this script can finish:
// 1. The user's password was updated successfully:
//    callback(null, true);
// 2. The user's password was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changePassword(email, newPassword, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY,
    region: configuration.AWS_REGION
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const params = {
    UserPoolId: configuration.AWS_COGNITO_POOL_ID,
    Username: email,
    Password: newPassword,
    Permanent: true
  };

  const result = new Promise((resolve, reject) => {
    provider.adminSetUserPassword(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  try {
    await result;
    callback(null, true);
  } catch (err) {
    callback(new Error(err));
  }
}
