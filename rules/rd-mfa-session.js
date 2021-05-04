async function multiFactorSession(user, context, callback) {
  const CLIENTS = ['Auth0 Demo SPA', 'Auth0 Demo Web App'];

  // check if MFA enabled for client
  if (!CLIENTS.includes(context.clientName)) {
    callback(null, user, context);
    return;
  }

  user.app_metadata = user.app_metadata || {};

  const {
    app_metadata: { enable_mfa: enableMfa = false }
  } = user;

  // check if MFA enabled for user
  if (!enableMfa) {
    callback(null, user, context);
    return;
  }

  context.authentication = context.authentication || {};

  const {
    authentication: { methods = [] }
  } = context;

  // check if MFA has been completed
  const completedMfa = !!methods.find((method) => method.name === 'mfa');

  if (completedMfa) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    allowRememberBrowser: false,
    provider: 'any'
  };

  callback(null, user, context);
}
