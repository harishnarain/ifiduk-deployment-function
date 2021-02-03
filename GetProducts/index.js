const mongoose = require('mongoose');

module.exports = async function (context, req) {
  mongoose.connect(process.env.MongoDbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', (err) => {
    context.log(`[ERROR]: ${err.message}`);
  });
  const Product = require('../models/Product');

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
