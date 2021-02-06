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
  frontend: {
    image: {
      type: String,
    },
    env: {
      type: Array,
    },
  },
  backend: {
    image: {
      type: String,
    },
    env: {
      type: Array,
    },
    port: {
      type: Number,
    },
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
