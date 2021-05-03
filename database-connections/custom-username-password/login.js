// There are three ways this script can finish:
// 1. The user's credentials are valid.
//    callback(null, profile);
// 2. The user's credentials are invalid
//    callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//    callback(new Error("my error message"));

async function login(email, password, callback) {
  const fetch = require('node-fetch@2.6.0');

  try {
    const token = await getToken();

    const url = `https://${configuration.DOMAIN_API}/api/databases/users/${email}/login`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password
      })
    });

    if (!res.ok) {
      const error = await res.json();
      callback(new Error(error.message));
      return;
    }

    const text = await res.text();

    if (text.length === 0) {
      callback(null);
      return;
    }

    const user = JSON.parse(text);
    user.user_id = user._id.toString();

    callback(null, user);
  } catch (err) {
    callback(err);
  }

  const getToken = async () => {
    const url = `https://${configuration.DOMAIN_AUTH0}/oauth/token`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: configuration.JWT_CLIENT_ID,
        client_secret: configuration.JWT_CLIENT_SECRET,
        audience: configuration.JWT_AUDIENCE
      })
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message);
    }

    return body.access_token;
  };
}
