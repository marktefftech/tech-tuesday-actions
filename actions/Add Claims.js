/** @type {PostLoginAction} */
const action = async (event, context) => {
  const NS = 'https://letsdoauth.com';

  const accessTokenClaims = {};
  accessTokenClaims[`${NS}/actions_claim`] = 'Access token claim.';

  const idTokenClaims = {};
  idTokenClaims[`${NS}/actions_claim`] = 'ID token claim.';

  return {
    accessToken: {
      customClaims: {
        ...accessTokenClaims,
      },
    },
    idToken: {
      customClaims: {
        ...idTokenClaims,
      },
    },
  };
};

module.exports = action;
