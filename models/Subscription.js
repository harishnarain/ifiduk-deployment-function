const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;
