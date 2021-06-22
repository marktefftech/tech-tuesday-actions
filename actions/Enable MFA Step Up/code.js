/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const CLIENTS = [
    "Auth0 Demo SPA",
    "Auth0 Demo Web App"
  ];

  // check if client is whitelisted

  if (!CLIENTS.includes(event.client.name)) {
    return;
  }

  if (!event.transaction) {
    return;
  }

  const acrValues = event.transaction.acr_values;

  if (
    !acrValues.includes(
      "http://schemas.openid.net/pape/policies/2007/06/multi-factor"
    )
  ) {
    return;
  }

  // enable mfa

  api.multifactor.enable("any", {
    allowRememberBrowser: false,
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
