const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: 'Name is required',
  },

  description: {
    type: String,
    required: false,
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
