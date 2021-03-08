/**
@param {object} client - information about the client
@param {string} client.name - name of client
@param {string} client.id - client id
@param {string} client.tenant - Auth0 tenant name
@param {object} client.metadata - client metadata
@param {array|undefined} scope - array of strings representing the scope claim or undefined
@param {string} audience - token's audience claim
@param {object} context - additional authorization context
@param {object} context.webtask - webtask context
@param {function} cb - function (error, accessTokenClaims)
*/
module.exports = async (client, scope, audience, context, cb) => {
  const NS = 'https://letsdoauth.com';
  const access_token = {};
  access_token.scope = scope;

  // Modify scopes or add extra claims
  access_token[`${NS}/claim`] = 'bar';

  cb(null, access_token);
};
