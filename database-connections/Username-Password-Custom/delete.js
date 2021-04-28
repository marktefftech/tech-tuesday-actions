// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(id, callback) {
  const fetch = require('node-fetch@2.6.0');
  const { URL } = require('url');

  const DOMAIN_API = configuration.DOMAIN_API;
  const DOMAIN_AUTH0 = configuration.DOMAIN_AUTH0;
  const JWT_AUDIENCE = configuration.JWT_AUDIENCE;
  const JWT_CLIENT_ID = configuration.JWT_CLIENT_ID;
  const JWT_CLIENT_SECRET = configuration.JWT_CLIENT_SECRET;

  try {
    const jwt = await requestJwt();

    const url = new URL(`https://${DOMAIN_API}/api/databases/users/${id}`);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    const body = await res.text();

    if (!res.ok) {
      const error = JSON.parse(body);
      callback(new Error(error.message));
      return;
    }

    callback(null);
  } catch (err) {
    callback(err);
  }

  async function requestJwt() {
    const url = new URL(`https://${DOMAIN_AUTH0}/oauth/token`);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: JWT_CLIENT_ID,
        client_secret: JWT_CLIENT_SECRET,
        audience: JWT_AUDIENCE
      })
    });

    const body = await res.json();

    return body.access_token;
  }
}
