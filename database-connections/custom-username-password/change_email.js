// There are three ways this script can finish:
// 1. The user's email/verified was updated successfully:
//    callback(null, true);
// 2. The user's email/verified was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changeEmail(email, newEmail, verified, callback) {
  const fetch = require('node-fetch@2.6.0');

  try {
    const token = await getToken();

    const url = `https://${configuration.DOMAIN_API}/api/databases/users/${email}/email`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newEmail: newEmail,
        verified: verified
      })
    });

    if (!res.ok) {
      const error = await res.json();
      callback(new Error(error.message));
      return;
    }

    callback(null, true);
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
}
