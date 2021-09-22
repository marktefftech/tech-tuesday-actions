/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const NS = 'https://letsdoauth.com';

  const { enable_mfa = false } = event.user.app_metadata;

  api.idToken.setCustomClaim(`${NS}/conn_name`, event.connection.name);
  api.idToken.setCustomClaim(`${NS}/conn_strategy`, event.connection.strategy);
  api.idToken.setCustomClaim(`${NS}/enable_mfa`, enable_mfa);
  api.idToken.setCustomClaim(`${NS}/org_name`, event?.organization?.name);

  if (!event.authorization) {
    return;
  }

  api.idToken.setCustomClaim(`${NS}/roles`, event.authorization.roles);
  api.accessToken.setCustomClaim(`${NS}/roles`, event.authorization.roles);
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
