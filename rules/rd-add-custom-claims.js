async function addCustomClaims(user, context, callback) {
  const NS = 'https://letsdoauth.com';

  user.app_metadata = user.app_metadata || {};

  const {
    app_metadata: { enableMfa = false }
  } = user;

  context.authorization = context.authorization || {};

  const {
    authorization: { roles = [] },
    connection = '',
    connectionStrategy = ''
  } = context;

  // Access token custom claims
  context.accessToken[`${NS}/roles`] = roles;

  // ID token custom claims
  context.idToken[`${NS}/connection`] = connection;
  context.idToken[`${NS}/connectionStrategy`] = connectionStrategy;
  context.idToken[`${NS}/enableMfa`] = enableMfa;
  context.idToken[`${NS}/roles`] = roles;

  callback(null, user, context);
}
