const { Builder, By, until } = require('selenium-webdriver');
const { selectors, config, uniqueEmail } = require('@bookstore/shared');

async function createDriver() {
  const remoteUrl = process.env.SELENIUM_REMOTE_URL || 'http://localhost:4444/wd/hub';
  const driver = await new Builder().forBrowser('chrome').usingServer(remoteUrl).build();
  await driver.manage().setTimeouts({ implicit: 0, pageLoad: config.timeouts.long });
  return driver;
}

async function openPath(driver, path) {
  await driver.get(`${config.baseUrl}${path}`);
}

async function registerUser(driver, password) {
  const email = uniqueEmail('bookstore');
  await openPath(driver, '/my-account/');
  await driver.wait(until.elementLocated(By.css(selectors.myAccount.email)), config.timeouts.long);
  await driver.findElement(By.css(selectors.myAccount.email)).sendKeys(email);
  await driver.findElement(By.css(selectors.myAccount.password)).sendKeys(password);
  await driver.findElement(By.css(selectors.myAccount.registerButton)).click();
  await driver.wait(until.elementLocated(By.css('.woocommerce-MyAccount-content')), config.timeouts.long);
  return email;
}

async function searchProduct(driver, term) {
  await openPath(driver, '/shop/');
  const searchInput = await driver.wait(
    until.elementLocated(By.css(selectors.search.input)),
    config.timeouts.long
  ).catch(async () => {
    return driver.findElement(By.css(selectors.search.fallbackInput));
  });
  await searchInput.clear();
  await searchInput.sendKeys(term);
  await driver.findElement(By.css(selectors.search.submit)).click();
  await driver.wait(until.elementLocated(By.css('.products')), config.timeouts.long);
}

async function addFirstProductToCart(driver) {
  await driver.wait(until.elementLocated(By.css(selectors.product.addToCartButton)), config.timeouts.long);
  const addBtn = await driver.findElement(By.css(selectors.product.addToCartButton));
  await addBtn.click();
  await driver.wait(until.elementLocated(By.css(selectors.product.viewCartLink)), config.timeouts.long);
  await driver.findElement(By.css(selectors.product.viewCartLink)).click();
  await driver.wait(until.elementLocated(By.css(selectors.cart.checkoutButton)), config.timeouts.long);
}

async function fillCheckout(driver, user) {
  await driver.findElement(By.css(selectors.cart.checkoutButton)).click();
  await driver.wait(until.elementLocated(By.css(selectors.checkout.firstName)), config.timeouts.long);

  await driver.findElement(By.css(selectors.checkout.firstName)).clear();
  await driver.findElement(By.css(selectors.checkout.firstName)).sendKeys(user.firstName);
  await driver.findElement(By.css(selectors.checkout.lastName)).clear();
  await driver.findElement(By.css(selectors.checkout.lastName)).sendKeys(user.lastName);
  await driver.findElement(By.css(selectors.checkout.address)).clear();
  await driver.findElement(By.css(selectors.checkout.address)).sendKeys(user.address);
  await driver.findElement(By.css(selectors.checkout.city)).clear();
  await driver.findElement(By.css(selectors.checkout.city)).sendKeys(user.city);
  await driver.findElement(By.css(selectors.checkout.postcode)).clear();
  await driver.findElement(By.css(selectors.checkout.postcode)).sendKeys(user.postcode);
  await driver.findElement(By.css(selectors.checkout.phone)).clear();
  await driver.findElement(By.css(selectors.checkout.phone)).sendKeys(user.phone);
  await driver.findElement(By.css(selectors.checkout.email)).clear();
  await driver.findElement(By.css(selectors.checkout.email)).sendKeys(user.email);

  const stripeOption = await driver.findElements(By.css(selectors.checkout.paymentStripe));
  if (stripeOption.length > 0) {
    await stripeOption[0].click();
    await fillStripeCard(driver);
  }
}

async function fillStripeCard(driver) {
  const cardNumber = process.env.STRIPE_CARD_NUMBER || '4242424242424242';
  const cardExp = process.env.STRIPE_CARD_EXP || '12/30';
  const cardCvc = process.env.STRIPE_CARD_CVC || '123';
  const cardZip = process.env.STRIPE_CARD_ZIP || '12345';

  const frameSelectors = [
    'iframe[name^="__privateStripeFrame"]',
    'iframe[name*="stripe"]',
    'iframe[title*="Secure"]'
  ];

  let frameFound = false;
  for (const selector of frameSelectors) {
    const frames = await driver.findElements(By.css(selector));
    if (frames.length > 0) {
      await driver.switchTo().frame(frames[0]);
      frameFound = true;
      break;
    }
  }

  if (!frameFound) {
    return;
  }

  const numberField = await driver.wait(until.elementLocated(By.css('input[name="cardnumber"]')), config.timeouts.long);
  await numberField.sendKeys(cardNumber);
  await driver.findElement(By.css('input[name="exp-date"]')).sendKeys(cardExp);
  await driver.findElement(By.css('input[name="cvc"]')).sendKeys(cardCvc);
  const zipField = await driver.findElements(By.css('input[name="postal"]'));
  if (zipField.length) {
    await zipField[0].sendKeys(cardZip);
  }

  await driver.switchTo().defaultContent();
}

async function placeOrder(driver) {
  await driver.findElement(By.css(selectors.checkout.placeOrder)).click();
  await driver.wait(until.elementLocated(By.css(selectors.order.receivedNotice)), config.timeouts.long);
}

async function openDownloads(driver) {
  await openPath(driver, '/my-account/downloads/');
  await driver.wait(until.elementLocated(By.css(selectors.downloads.links)), config.timeouts.long);
}

module.exports = {
  createDriver,
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder,
  openDownloads
};
