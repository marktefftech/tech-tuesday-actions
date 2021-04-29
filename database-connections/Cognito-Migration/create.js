// There are three ways this script can finish:
// 1. A user was successfully created:
//    callback(null);
// 2. This user already exists in your database
//    callback(new ValidationError("user_exists", "my error message"));
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function create(user, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY,
    region: configuration.AWS_REGION
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  var params = {
    UserPoolId: configuration.AWS_COGNITO_POOL_ID,
    Username: user.email,
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: user.email_verified || 'false'
      }
    ]
  };

  const result = new Promise((resolve, reject) => {
    provider.adminCreateUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  try {
    await result;
    callback(null);
  } catch (err) {
    callback(new Error(err));
  }
}
