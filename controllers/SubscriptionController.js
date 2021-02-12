const db = require('../config/dbConfig');
const validate = require('../shared/validate');
const queueDeployment = require('../shared/queueDeployment');

exports.getSubscriptions = async (req, res) => {
  const Organization = require('../models/Organization');
  db();

  req.context.log('Getting Subscriptions...');

  // Generate query
  let query = '';

  if (req.query.name) {
    //query = new RegExp('^' + req.query.name, 'i');
    query = req.query.name.toLowerCase();
  }

  // Get subscriptions based on orgId
  const userIdentifier = req.authInfo.oid;

  try {
    const orgSubscriptions = await Organization.findOne({ name: userIdentifier }).populate(
      'subscriptions'
    );

    let subscriptions;

    if (query && orgSubscriptions) {
      filteredSubscriptions = orgSubscriptions.subscriptions.filter((subscription) =>
        subscription.name.startsWith(query)
      );
      return {
        status: 200,
        body: filteredSubscriptions,
      };
    } else if (orgSubscriptions) {
      return {
        status: 200,
        body: orgSubscriptions.subscriptions,
      };
    } else {
      return {
        status: 404,
        body: 'No organization found!',
      };
    }
  } catch (err) {
    req.context.log(err);
    return {
      status: 500,
      body: 'An error occured processing requests.',
    };
  }
};

exports.createSubscription = async (req, res) => {
  const Subscription = require('../models/Subscription');
  const Product = require('../models/Product');
  const Organization = require('../models/Organization');
  db();

  req.context.log('Creating Subscription...');
  // Check to ensure a request body exists
  if (!req.body) {
    return {
      status: 400,
      body: 'A request body is required!',
    };
  }

  // Extract oid from user claims
  const userIdentifier = req.authInfo.oid;

  // Extract org based on oid
  let org;
  try {
    org = await Organization.findOne({ name: userIdentifier });
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

    // Prepare deployment message
    const deploymentMessage = {
      action: 'create',
      name: name,
      subscriptionId: _id,
      frontend: {
        name: `${_id}_fe`,
      },
      backend: {
        name: `${_id}_be`,
      },
    };

    // Create object for product
    const product = await Product.findById(productId);

    // Add container image names for frontend and backend
    deploymentMessage.frontend.image = product.frontend.image;
    deploymentMessage.backend.image = product.backend.image;

    // Add ports to backend
    deploymentMessage.backend.port = product.backend.port;

    // Add environment variables to frontend and backend
    if (product.frontend.env.length > 0) {
      deploymentMessage.frontend.env = [];
      product.frontend.env.forEach((env) => {
        const key = Object.keys(env)[0];
        let value;
        if (env[key].includes('##BACKEND_HOST##')) {
          value = env[key].replace('##BACKEND_HOST##', `${_id}_be`);
        } else {
          value = env[key];
        }

        const newEnv = {};
        newEnv[key] = value;
        deploymentMessage.frontend.env.push(newEnv);
      });
    }

    if (product.backend.env.length > 0) {
      deploymentMessage.backend.env = product.backend.env;
    }

    const message = await queueDeployment(deploymentMessage);

    const createdSub = {
      _id: _id,
      name: subName,
      productId: subProductId,
      orgId: subOrgId,
      status: subStatus,
    };

    return {
      status: 201,
      body: createdSub,
    };
  } catch (err) {
    return {
      status: 500,
      body: `An error occured creating the subscriptions\n${err}`,
    };
  }
};
