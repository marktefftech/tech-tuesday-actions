// There are three ways this script can finish:
// 1. The user's credentials are valid.
//    callback(null, profile);
// 2. The user's credentials are invalid
//    callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//    callback(new Error("my error message"));

async function login(email, password, callback) {
  const AmazonCognitoIdentity = require('amazon-cognito-identity-js@3.0.14');

  global.fetch = require('node-fetch@2.6.0');

  const authData = { Username: email, Password: password };
  const authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authData);

  const userPoolData = {
    UserPoolId: configuration.AWS_COGNITO_POOL_ID,
    ClientId: configuration.AWS_COGNITO_CLIENT_ID
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);

  const userData = { Username: email, Pool: userPool };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  const result = new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const { email, email_verified, sub } = result.getIdToken().payload;
        const profile = {
          email: email,
          email_verified: email_verified,
          user_id: sub
        };
        resolve(profile);
      },
      onFailure: (err) => reject(err)
    });
  });

  try {
    const profile = await result;
    callback(null, profile);
  } catch (err) {
    callback(new Error(err));
  }
}
