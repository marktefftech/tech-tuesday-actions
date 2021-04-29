// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(user_id, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY,
    region: configuration.AWS_REGION
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const deleteUser = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: email
      };
      provider.adminDeleteUser(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

  try {
    await deleteUser();
    callback(null);
  } catch (err) {
    callback(new Error(err.message));
  }
}
