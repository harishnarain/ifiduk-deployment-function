const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Product = require('../models/Product');
  db();

  context.log('Getting Products...');

  try {
    const products = await Product.find();

    return {
      status: 200,
      body: products,
    };
  } catch (err) {
    return {
      status: 400,
      body: 'Error getting products!',
    };
  }
};
