const db = require('../config/dbConfig');
const queueDeployment = require('../shared/queueDeployment');

module.exports = async function (context, req) {
  const Subscription = require('../models/Subscription');
  const Organization = require('../models/Organization');
  db();

  context.log('Deleting Subscription...');

  // Extract oid from user claims
  // Temporarily providing in request body for dev
  const userIdentifier = '05d0ae08-ecb9-4054-9025-90410ac6f164';

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

  let sub;
  // Check if subscription exists
  try {
    sub = await Subscription.findById(req.params.id);
  } catch (err) {
    return {
      status: 404,
      body: `Subscription ${req.params.id} does not exists!`,
    };
  }

  // Delete subscription
  try {
    // Update the subscription to status deleting
    sub.status = 'Deleting';
    await sub.save();

    // Prepare deployment message
    const deploymentMessage = {
      action: 'delete',
      subscriptionId: sub._id,
      name: sub.name,
    };

    // Send message to deployment queue
    const message = await queueDeployment(deploymentMessage);

    return {
      status: 202,
      body: message,
    };
  } catch {
    return {
      status: 500,
      body: `An error occurred deleting the subscription\n${err}`,
    };
  }
};
