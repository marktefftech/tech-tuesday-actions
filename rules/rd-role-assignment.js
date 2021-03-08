async function boostrap(user, context, callback) {
  const NS = 'https://letsdoauth.com';
  context.authorization = context.authorization || {};

  const {
    authorization: { roles = [] },
    connection = '',
    connectionStrategy = ''
  } = context;

  if (connectionStrategy === 'auth0' && !roles.length) {
    try {
      const result = await global.management.assignRolestoUser(
        { id: user.user_id },
        { roles: ['rol_Q77GDsXEfL3qpYmu'] }
      );
      // ID token custom claims
      context.idToken[`${NS}/role_assignment`] = true;
    } catch (err) {
      console.log(err);
    }
  }

  callback(null, user, context);
}
