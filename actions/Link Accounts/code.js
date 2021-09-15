/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const jwt = require('jsonwebtoken');
  const queryString = require('querystring');
  const ManagementClient = require('auth0').ManagementClient;

  const createManagementClient = () =>
    new ManagementClient({
      domain: event.secrets.DOMAIN,
      clientId: event.secrets.CLIENT_ID,
      clientSecret: event.secrets.CLIENT_SECRET,
      scope: 'read:users'
    });

  const createToken = () => {
    var payload = {
      sub: event.user.user_id,
      email: event.user.email,
      base: `https://${event.secrets.DOMAIN}`
    };

    var options = {
      expiresIn: '5m',
      audience: event.secrets.CLIENT_ID,
      issuer: `https://idp.letsdoauth.com/`
    };

    return jwt.sign(payload, event.secrets.CLIENT_SECRET, options);
  };

  const createRedirectUrl = (token, query, errorType) => {
    var params = {
      child_token: token,
      client_id: query.client_id,
      redirect_uri: query.redirect_uri,
      response_mode: query.response_mode,
      response_type: query.response_type,
      audience: query.audience,
      scope: query.scope,
      auth0Client: query.auth0Client,
      original_state: query.original_state || query.state,
      nonce: query.nonce,
      error_type: errorType
    };

    return (
      // 'https://rudydahbura.us12.webtask.io/4cb95bf92ced903b9b84ebedbf5ebffd?' +
      'http://localhost:3000/callback-link-account?' +
      queryString.encode(params)
    );
  };

  const isFirstLogin = () => event.stats.logins_count <= 1;
  if (!isFirstLogin()) {
    return;
  }

  const management = createManagementClient();
  const userSearch = await management.getUsersByEmail(event.user.email);
  const filteredUsers = userSearch
    .filter(
      (u) =>
        u.user_id !== event.user.user_id &&
        u.identities.filter((i) => i.connection === 'username-password')
          .length > 0
    )
    .map((u) => ({
      email: u.email,
      user_id: u.user_id,
      connections: u.identities.map((i) => i.connection)
    }));

  const isUniqueUser = () => filteredUsers.length === 1;
  if (!isUniqueUser) {
    return;
  }

  const token = createToken();
  const redirectUrl = createRedirectUrl(token, event.request.query);
  api.redirect.sendUserTo(redirectUrl);
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  console.log(event);
};
