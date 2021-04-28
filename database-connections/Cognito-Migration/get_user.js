// There are three ways this script can finish:
// 1. A user was successfully found.
//    callback(null, profile);
// 2. A user was not found
//    callback(null);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function getUser(email, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY,
    region: configuration.AWS_REGION
  });

  const cognitoGetUserAttr = (attrs, name) =>
    attrs.find((item) => item.Name === name).Value;

  const provider = new AWS.CognitoIdentityServiceProvider();

  const params = {
    Username: email,
    UserPoolId: configuration.AWS_COGNITO_POOL_ID
  };

  const result = new Promise((resolve, reject) => {
    provider.adminGetUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      const attrs = data.UserAttributes;
      const email = cognitoGetUserAttr(attrs, 'email');
      const email_verified = cognitoGetUserAttr(attrs, 'email_verified');
      const user_id = cognitoGetUserAttr(attrs, 'sub');
      const profile = {
        email: email,
        email_verified: email_verified,
        user_id: user_id
      };
      resolve(profile);
    });
  });

  try {
    const profile = await result;
    callback(null, profile);
  } catch (err) {
    callback(new Error(err));
  }
}
