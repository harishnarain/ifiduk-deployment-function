const db = require('../config/dbConfig');

exports.getProducts = async (req, res) => {
  const Product = require('../models/Product');
  db();

  req.context.log('Getting Products...');

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
    req.context.log(products);

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
