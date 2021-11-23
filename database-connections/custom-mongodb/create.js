// There are three ways this script can finish:
// 1. A user was successfully created:
//    callback(null);
// 2. This user already exists in your database
//    callback(new ValidationError("user_exists", "my error message"));
// 3. Something went wrong while trying to reach your database:
//    callback(new Error("my error message"));

async function create(user, callback) {
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

    let url = `http://${configuration.DOMAIN_API}/db/users`;

    let res = await axios.post(url, user, {
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

    callback(null);
  } catch (err) {
    callback(err);
  }
}
