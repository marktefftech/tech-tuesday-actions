async function addDelegatedAdminExtRoles(user, context, callback) {
  const CLIENT = 'Auth0 Delegated Admin';
  const ROLE_ADMIN = 'Delegated Admin - Administrator';
  const ROLE_USER = 'Delegated Admin - User';

  if (context.clientName !== CLIENT) {
    callback(null, user, context);
    return;
  }

  user.app_metadata = user.app_metadata || {};

  const {
    app_metadata: { roles: metadata_roles = [] }
  } = user;

  if (
    metadata_roles.includes(ROLE_ADMIN) ||
    metadata_roles.includes(ROLE_USER)
  ) {
    callback(null, user, context);
    return;
  }

  context.authorization = context.authorization || {};

  const {
    authorization: { roles: authorization_roles = [] }
  } = context;

  user.app_metadata.roles = authorization_roles.includes('Administrator')
    ? [ROLE_ADMIN]
    : [ROLE_USER];

  auth0.users
    .updateAppMetadata(user.user_id, user.app_metadata)
    .then(() => callback(null, user, context))
    .catch((err) => callback(err));
}
