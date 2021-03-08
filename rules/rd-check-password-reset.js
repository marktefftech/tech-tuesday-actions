async function checkPasswordReset(user, context, callback) {
  const AuthenticationClient = require('auth0@2.30.0').AuthenticationClient;

  const authentication = new AuthenticationClient({
    domain: auth0.domain,
    clientId: context.clientID
  });

  function daydiff(first, second) {
    return (second - first) / (1000 * 60 * 60 * 24);
  }

  const last_password_reset = user.last_password_reset || user.created_at;

  if (daydiff(new Date(last_password_reset), new Date()) > 30) {
    var data = {
      email: user.email,
      client_id: context.clientID,
      connection: context.connection
    };

    authentication.requestChangePasswordEmail(data, (err, message) => {
      if (err) {
        // Handle error.
      }
    });

    callback(new UnauthorizedError('Please change your password.'));
    return;
  }

  callback(null, user, context);
}
