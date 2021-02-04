const db = require('../config/dbConfig');
const validate = require('../shared/validate');

module.exports = async function (context, req) {
  const Subscription = require('../models/Subscription');
  const Product = require('../models/Product');
  const Organization = require('../models/Organization');
  db();

  context.log('Creating Subscription...');

  // Check to ensure a request body exists
  if (!req.body) {
    return {
      status: 400,
      body: 'A request body is required!',
    };
  }

  // Extract email from user claims
  // Temporarily providing in request body for dev
  const email = req.body.email.toLowerCase();

  // Extract org based on email
  let org;
  try {
    org = await Organization.findOne({ name: email });
  } catch (err) {
    return {
      status: 500,
      body: 'An error occured processing your request.',
    };
  }

  // Check if org exits
  if (!org) {
    return {
      status: 400,
      body: 'Error determining organization',
    };
  }

  // Extract product ID from request body
  let productId;
  if (req.body.productId) {
    productId = req.body.productId;
  } else {
    return {
      status: 500,
      body: 'Request body does not contain the productId!',
    };
  }

  // Check if productId exists
  try {
    await Product.findById(productId);
  } catch (err) {
    return {
      status: 400,
      body: `An error occured finding product with ID: ${productId}`,
    };
  }

  // Validate subscription name
  let name;
  if (req.body.name && validate.subscriptionName(req.body.name)) {
    name = req.body.name.toLowerCase();
  } else {
    return {
      status: 400,
      body: `${req.body.name} is an invalid subscription name!`,
    };
  }

  // Check if subscription name already exists
  try {
    const sub = await Subscription.findOne({ name: name });
    if (sub) {
      return {
        status: 400,
        body: `Subscription ${name} already exists!`,
      };
    }
  } catch (err) {
    return {
      status: 400,
      body: 'An error occured processing your request.',
    };
  }

  // Create subscription
  try {
    const {
      _id,
      name: subName,
      productId: subProductId,
      orgId: subOrgId,
      status: subStatus,
    } = await Subscription.create({
      name: name,
      productId: productId,
      orgId: org._id,
      status: 'Pending',
    });
    await Organization.findByIdAndUpdate(org._id, { $push: { subscriptions: _id } }, { new: true });
    return {
      status: 201,
      body: {
        _id: _id,
        name: subName,
        productId: subProductId,
        orgId: subOrgId,
        status: subStatus,
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: `An error occured creating the subscriptions\n${err}`,
    };
  }
};
