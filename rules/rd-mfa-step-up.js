async function multiFactorStepUp(user, context, callback) {
  const CLIENTS = ['Auth0 Demo SPA', 'Auth0 Demo Web App'];

  // check if MFA enabled for client
  if (!CLIENTS.includes(context.clientName)) {
    callback(null, user, context);
    return;
  }

  context.request = context.request || {};

  const {
    request: { query = {} }
  } = context;

  if (
    query.acr_values !==
    'http://schemas.openid.net/pape/policies/2007/06/multi-factor'
  ) {
    callback(null, user, context);
    return;
  }

  context.multifactor = {
    allowRememberBrowser: false,
    provider: 'any'
  };

  callback(null, user, context);
}
