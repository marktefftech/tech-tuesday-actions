// There are three ways this script can finish:
// 1. A user was successfully found.
//    callback(null, profile);
// 2. A user was not found
//    callback(null);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function getUser(email, callback) {
  const fetch = require('node-fetch@2.6.0');

  const getToken = async () => {
    const url = `https://${configuration.DOMAIN_AUTH0}/oauth/token`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        audience: configuration.JWT_AUDIENCE,
        client_id: configuration.JWT_CLIENT_ID,
        client_secret: configuration.JWT_CLIENT_SECRET
      })
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message);
    }

    return body.access_token;
  };

  try {
    const token = await getToken();

    const url = `https://${configuration.DOMAIN_API}/db/users/${email}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      callback(new Error(error.msg));
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
}
