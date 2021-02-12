const express = require('express');
const createHandler = require('azure-function-express').createHandler;
const app = express();
app.use(require('body-parser').urlencoded({ extended: true }));

const { getProducts } = require('../controllers/ProductController');

app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts(req, res);

    res.status(products.status).json(products.body);
  } catch (err) {
    res.status(err.status).json(err.body);
  }
});

module.exports = createHandler(app);
