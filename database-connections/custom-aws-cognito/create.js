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
    region: configuration.AWS_REGION,
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const signUp = () =>
    new Promise((resolve, reject) => {
      const params = {
        ClientId: configuration.AWS_COGNITO_CLIENT_ID,
        Password: user.password,
        Username: user.email
      };
      provider.signUp(params, (err, data) =>
        err ? reject(err) : resolve(data)
      );
    });

  const confirmSignUp = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: user.email
      };
      provider.adminConfirmSignUp(params, (err, data) =>
        err ? reject(err) : resolve(data)
      );
    });

  try {
    await signUp();
    await confirmSignUp();
    callback(null);
  } catch (err) {
    callback(new Error(err.message));
  }
}
