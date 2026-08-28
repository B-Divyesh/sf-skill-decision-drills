const productSlug = 'skill-decision-drills';
const productOrigin = 'https://skill-decision-drills.sociobot.in';
const apiBase = 'https://api.sociobot.in/api/v1';

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const site = await fetch(productOrigin, { redirect: 'manual' });
expect(site.status === 200, `Product origin returned HTTP ${site.status}, expected 200.`);
const html = await site.text();
expect(html.includes('<html lang="en">'), 'Product origin is missing lang="en".');
expect(html.includes('<title>Skill Decision Drills'), 'Product origin has the wrong product title.');

const catalogResponse = await fetch(`${apiBase}/products`, { headers: { Accept: 'application/json' } });
expect(catalogResponse.ok, `Product catalog returned HTTP ${catalogResponse.status}.`);
const catalog = await catalogResponse.json();
const product = catalog.data?.find((item) => item.slug === productSlug);
expect(product, `Product catalog does not contain ${productSlug}.`);
expect(product.price_minor === 2900 && product.currency === 'USD', 'Product catalog price must be USD 29.00.');
expect(product.product_url === `${productOrigin}/`, 'Product catalog return URL does not match the production origin.');

const checkout = await fetch(`${apiBase}/products/${productSlug}/checkout`, { redirect: 'manual' });
expect(checkout.status === 303, `Checkout returned HTTP ${checkout.status}, expected 303.`);
expect(checkout.headers.get('location')?.startsWith('https://checkout.dodopayments.com/'), 'Checkout did not redirect to the hosted payment page.');

const verify = await fetch(`${apiBase}/products/${productSlug}/verify?license=qa-invalid-token`, {
  headers: { Origin: productOrigin }
});
expect(verify.ok, `License verification returned HTTP ${verify.status}.`);
expect(verify.headers.get('access-control-allow-origin') === productOrigin, 'License verification CORS does not allow the product origin.');
const verdict = await verify.json();
expect(verdict.valid === false && verdict.reason === 'invalid', 'The QA invalid token did not receive the expected invalid verdict.');

console.log(`Live identity, catalog, checkout redirect, CORS, and invalid-license policy passed for ${productOrigin}.`);
