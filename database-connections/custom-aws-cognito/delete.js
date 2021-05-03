// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(user_id, callback) {
  const AWS = require('aws-sdk@2.593.0');

  AWS.config.update({
    region: configuration.AWS_REGION,
    accessKeyId: configuration.AWS_ACCESS_KEY_ID,
    secretAccessKey: configuration.AWS_SECRET_ACCESS_KEY
  });

  const provider = new AWS.CognitoIdentityServiceProvider();

  const getAttrValue = (attrs, name) =>
    attrs.find((item) => item.Name === name).Value;

  const getUserById = () =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        AttributesToGet: ['email'],
        Filter: `sub="${user_id}"`
      };
      provider.listUsers(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data.Users.length === 0) {
          reject(new Error('User not found.'));
          return;
        }
        if (data.Users.length > 1) {
          reject(new Error('Unique user not found.'));
          return;
        }
        resolve(data.Users[0]);
      });
    });

  const deleteUser = (email) =>
    new Promise((resolve, reject) => {
      const params = {
        UserPoolId: configuration.AWS_COGNITO_POOL_ID,
        Username: email
      };
      provider.adminDeleteUser(params, (err, data) =>
        err ? reject(err) : resolve(data)
      );
    });

  try {
    const user = await getUserById();
    const email = getAttrValue(user.Attributes, 'email');
    await deleteUser(email);
    callback(null);
  } catch (err) {
    callback(new Error(err.message));
  }
}
