const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrganizationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  technicalContact: {
    type: String,
    required: true,
  },
  subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription' }],
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
