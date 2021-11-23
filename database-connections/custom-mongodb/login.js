// There are three ways this script can finish:
// 1. The user's credentials are valid.
//    callback(null, profile);
// 2. The user's credentials are invalid
//    callback(new WrongUsernameOrPasswordError(email, "my error message"));
// 3. Something went wrong while trying to reach your database
//    callback(new Error("my error message"));

async function login(email, password, callback) {
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

    const url = `https://${configuration.DOMAIN_API}/db/logins`;

    const res = await axios.post(
      url,
      {
        email: email,
        password: password
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

    if (res.data.length === 0) {
      callback(null);
      return;
    }

    const user = res.data;

    callback(null, {
      user_id: user._id.toString(),
      email: user.email,
      email_verified: user.email_verified,
      family_name: user.family_name,
      given_name: user.given_name
    });
  } catch (err) {
    callback(err);
  }
}
