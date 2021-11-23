// There are three ways this script can finish:
// 1. The user's password was updated successfully:
//    callback(null, true);
// 2. The user's password was not updated:
//    callback(null, false);
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function changePassword(email, newPassword, callback) {
  const axios = require('axios@0.22.0');
  const qs = require('qs');

  const getToken = async () => {
    const url = `https://${configuration.DOMAIN_AUTH0}/oauth/token`;

    const res = await axios.post(
      url,
      qs.stringify({
        grant_type: 'client_credentials',
        client_id: configuration.JWT_CLIENT_ID,
        client_secret: configuration.JWT_CLIENT_SECRET,
        audience: configuration.JWT_AUDIENCE
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (res.status < 200 || res.status >= 300) {
      const error = res.data;
      throw new Error(error.msg);
    }

    return res.data.access_token;
  };

  try {
    const token = await getToken();

    let url = `http://${configuration.DOMAIN_API}/db/users?email=${email}`;

    let res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status < 200 || res.status >= 300) {
      const error = res.data;
      callback(new Error(error.msg));
      return;
    }

    if (res.data.length === 0) {
      callback(null);
      return;
    }

    const user = res.data[0];

    url = `http://${configuration.DOMAIN_API}/db/users/${user._id}`;

    res = await axios.patch(
      url,
      {
        password: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (res.status < 200 || res.status >= 300) {
      const error = res.data;
      callback(new Error(error.msg));
      return;
    }

    callback(null, true);
  } catch (err) {
    callback(err);
  }
}
