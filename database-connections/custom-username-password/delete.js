// There are two ways this script can finish:
// 1. The user was removed successfully:
//    callback(null);
// 2. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function remove(user_id, callback) {
  const fetch = require('node-fetch@2.6.0');

  try {
    const token = await getToken();

    const url = `https://${configuration.DOMAIN_API}/api/databases/users/${user_id}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const error = await res.json();
      callback(new Error(error.message));
      return;
    }

    callback(null);
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
