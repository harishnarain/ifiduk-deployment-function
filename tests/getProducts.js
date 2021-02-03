const mongoose = require('mongoose');
const Product = require('../models/Product');

const getProducts = async () => {
  mongoose.connect(
    process.env.MongoDbConnectionString ||
      'mongodb://root:lanier@localhost/ifidukDB?authSource=admin',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', (err) => {
    console.log(`[ERROR]: ${err.message}`);
  });

  console.log('Getting Products...');
  Product.find()
    .then((products) => {
      console.log(products);
    })
    .catch((err) => {
      console.error(err);
    });
};

getProducts();
