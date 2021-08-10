/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const clients = ['Auth0 Demo SPA', 'Auth0 Demo Web App'];

  // check if client is whitelisted

  if (!clients.includes(event.client.name)) {
    return;
  }

  // check if MFA has been enabled

  const { enable_mfa: enableMfa = false } = event.user.app_metadata;

  if (!enableMfa) {
    return;
  }

  // check if MFA has been completed

  if (!!event.authentication?.methods?.find((m) => m.name === 'mfa')) {
    return;
  }

  // enable MFA

  api.multifactor.enable('any', {
    allowRememberBrowser: false
  });
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
