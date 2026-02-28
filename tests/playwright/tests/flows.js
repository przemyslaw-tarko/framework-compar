const { selectors, uniqueEmail } = require('@bookstore/shared');

async function registerUser(page, password) {
  const email = uniqueEmail('bookstore');
  await page.goto('/my-account/');
  await page.locator(selectors.myAccount.email).fill(email);
  await page.locator(selectors.myAccount.password).fill(password);
  await page.locator(selectors.myAccount.registerButton).click();
  await page.locator('.woocommerce-MyAccount-content').waitFor({ timeout: 30000 });
  return email;
}

async function searchProduct(page, term) {
  await page.goto('/shop/');
  if (await page.locator(selectors.search.input).count()) {
    await page.locator(selectors.search.input).fill(term);
  } else {
    await page.locator(selectors.search.fallbackInput).fill(term);
  }
  await page.locator(selectors.search.submit).click();
  await page.locator('.products').waitFor({ timeout: 30000 });
}

async function addFirstProductToCart(page) {
  await page.locator(selectors.product.addToCartButton).first().click();
  await page.locator(selectors.product.viewCartLink).click();
  await page.locator(selectors.cart.checkoutButton).waitFor({ timeout: 30000 });
}

async function fillStripeCard(page) {
  const cardNumber = process.env.STRIPE_CARD_NUMBER || '4242424242424242';
  const cardExp = process.env.STRIPE_CARD_EXP || '12/30';
  const cardCvc = process.env.STRIPE_CARD_CVC || '123';
  const cardZip = process.env.STRIPE_CARD_ZIP || '12345';

  const frameLocator = page.frameLocator('iframe[name^="__privateStripeFrame"], iframe[name*="stripe"], iframe[title*="Secure"]');
  if (await frameLocator.locator('input[name="cardnumber"]').count()) {
    await frameLocator.locator('input[name="cardnumber"]').fill(cardNumber);
    await frameLocator.locator('input[name="exp-date"]').fill(cardExp);
    await frameLocator.locator('input[name="cvc"]').fill(cardCvc);
    if (await frameLocator.locator('input[name="postal"]').count()) {
      await frameLocator.locator('input[name="postal"]').fill(cardZip);
    }
  }
}

async function fillCheckout(page, user) {
  await page.locator(selectors.cart.checkoutButton).click();
  await page.locator(selectors.checkout.firstName).fill(user.firstName);
  await page.locator(selectors.checkout.lastName).fill(user.lastName);
  await page.locator(selectors.checkout.address).fill(user.address);
  await page.locator(selectors.checkout.city).fill(user.city);
  await page.locator(selectors.checkout.postcode).fill(user.postcode);
  await page.locator(selectors.checkout.phone).fill(user.phone);
  await page.locator(selectors.checkout.email).fill(user.email);

  if (await page.locator(selectors.checkout.paymentStripe).count()) {
    await page.locator(selectors.checkout.paymentStripe).check();
    await fillStripeCard(page);
  }
}

async function placeOrder(page) {
  await page.locator(selectors.checkout.placeOrder).click();
  await page.locator(selectors.order.receivedNotice).waitFor({ timeout: 30000 });
}

async function openDownloads(page) {
  await page.goto('/my-account/downloads/');
  await page.locator(selectors.downloads.links).first().waitFor({ timeout: 30000 });
}

module.exports = {
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder,
  openDownloads
};
