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
    region: configuration.AWS_REGION,
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const getAttrValue = (attrs, name) =>
    attrs.find((item) => item.Name === name).Value;

  const userProps = ['email', 'email_verified'];

  const getUser = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: email
      };
      provider.adminGetUser(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const userAttrs = data.UserAttributes;
        const userProfile = { user_id: getAttrValue(userAttrs, 'sub') };
        userProps.forEach((i) => (userProfile[i] = getAttrValue(userAttrs, i)));
        resolve(userProfile);
      });
    });

  try {
    const user = await getUser();
    callback(null, user);
  } catch (err) {
    if (err.code === 'UserNotFoundException') {
      callback(null);
    } else {
      callback(new Error(err.message));
    }
  }
}
