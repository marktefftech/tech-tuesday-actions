/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are 
logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the 
behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const NS = 'https://letsdoauth.com';
  const ManagementClient = require('auth0').ManagementClient;

  const createManagementClient = () =>
    new ManagementClient({
      domain: event.secrets.DOMAIN,
      clientId: event.secrets.CLIENT_ID,
      clientSecret: event.secrets.CLIENT_SECRET,
      scope: 'read:roles update:users'
    });

  const roleAdmin = {
    // This comes from the "Roles section of User Management"
    id: 'rol_MukO811Zlgf0Tc0n',
    name: 'Rewards Member'
  };

  if (event.authorization?.roles?.includes(roleAdmin.name)) {
    return;
  }

  try {
    const management = createManagementClient();
    await management.assignRolestoUser(
      { id: event.user.user_id },
      { roles: [roleAdmin.id] }
    );
    api.idToken.setCustomClaim(`${NS}/role_assignment`, true);
  } catch (err) {
    console.log(err);
  }
};
