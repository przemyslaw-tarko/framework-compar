const selectors = {
  myAccount: {
    email: '#reg_email',
    password: '#reg_password',
    registerButton: 'button[name="register"]'
  },
  login: {
    username: '#username',
    password: '#password',
    loginButton: 'button[name="login"]'
  },
  search: {
    input: '#woocommerce-product-search-field-0',
    fallbackInput: 'input[type="search"]',
    submit: 'button[type="submit"]'
  },
  product: {
    addToCartButton: '.products .product a.button',
    viewCartLink: 'a.added_to_cart'
  },
  cart: {
    checkoutButton: '.checkout-button'
  },
  checkout: {
    firstName: '#billing_first_name',
    lastName: '#billing_last_name',
    address: '#billing_address_1',
    city: '#billing_city',
    postcode: '#billing_postcode',
    phone: '#billing_phone',
    email: '#billing_email',
    paymentStripe: '#payment_method_stripe',
    placeOrder: '#place_order'
  },
  order: {
    receivedNotice: '.woocommerce-thankyou-order-received'
  },
  downloads: {
    links: '.woocommerce-downloads a'
  }
};

module.exports = { selectors };
