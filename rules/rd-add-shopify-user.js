async function addShopifyUser(user, context, callback) {
  const API_KEY = '##SHOPIFY_API_KEY##';
  const API_PWD = '##SHOPIFY_API_PWD##';
  const API_URL = '##SHOPIFY_API_URL##';

  try {
    const url = new URL(
      `https://${API_KEY}:${API_PWD}@${API_URL}/admin/api/2020-04/customers.json`
    );

    await global.postAsync(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: {
          first_name: user.given_name,
          last_name: user.family_name,
          email: user.email,
          verified_email: user.email_verified
        }
      })
    });

    callback(null, user, context);
  } catch (err) {
    callback(err);
  }
}
