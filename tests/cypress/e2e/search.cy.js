const { searchProduct } = require('../support/flows');

it('[C1002] Browse and search products', () => {
  searchProduct('book');
});
