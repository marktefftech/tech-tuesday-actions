async function boostrap(user, context, callback) {
  const _ = require('lodash@4.17.10');
  const fetch = require('node-fetch@2.6.0');
  const managementClient = require('auth0@2.30.0').ManagementClient;

  // Limit access to the following audience, client credentials exchange only.
  const excludedAudiences = ['https://api-db.letsdoauth.com'];

  const audience = _.get(context, 'request.query.audience', '').toLowerCase();
  if (excludedAudiences.includes(audience)) {
    callback(new UnauthorizedError('Cannot access protected API.'));
    return;
  }

  // prettier-ignore
  global.isJson = global.isJson || function (resp) {
    const contentType = resp.headers.get('Content-Type') || resp.headers.get('content-type') || '';
    return contentType.includes('application/json');
  };

  // prettier-ignore
  global.management = global.management || new managementClient({
    domain: auth0.domain,
    token: auth0.accessToken
  });

  // prettier-ignore
  global.postAsync = global.postAsync || async function (url, options) {
    const res = await fetch(url, { ...options, method: 'POST' });
    const body = await res.text();
    if (res.ok) {
      return global.isJson(res) ? JSON.parse(body) : body;
    }
    throw new Error(body);
  };

  callback(null, user, context);
}
