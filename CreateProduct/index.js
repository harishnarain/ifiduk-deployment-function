const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Product = require('../models/Product');
  db();

  context.log('Creating Product...');

  // Check to ensure a request body exists
  if (!req.body) {
    return {
      status: 400,
      body: 'A request body is required',
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
