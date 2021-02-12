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

exports.createProduct = async (req, res) => {
  const Product = require('../models/Product');
  db();

  req.context.log('Creating Product...');

  // Check to ensure a request body exists
  if (!req.body) {
    return {
      status: 400,
      body: 'A request body is required',
    };
  }

  // Check if user is logged in
  if (!req.authInfo.oid) {
    return {
      status: 401,
      body: 'Invalid or missing token',
    };
  }

  // Create product
  try {
    const { _id, name, description, frontend, backend } = await Product.create({
      name: req.body.name,
      description: req.body.description,
      frontend: { ...req.body.frontend },
      backend: { ...req.body.backend },
    });

    return {
      status: 201,
      body: {
        _id,
        name,
        description,
        frontend,
        backend,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: `An error occured creating the product\n${err}`,
    };
  }
};
