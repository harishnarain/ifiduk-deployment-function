const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Product = require('../models/Product');
  db();

  context.log('Getting Products...');

  // Generate query
  let query = '';

  if (req.query.name) {
    query = new RegExp('^' + req.query.name, 'i');
  }

  try {
    let products;
    if (query) {
      products = await Product.find({ name: { $regex: query } });
    } else {
      products = await Product.find();
    }
    context.log(products);

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
