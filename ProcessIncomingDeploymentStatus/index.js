const db = require('../config/dbConfig');

module.exports = async function (context, deploymentStatusMessage) {
  const Subscription = require('../models/Subscription');
  context.log(
    'JavaScript ServiceBus queue trigger function processed message',
    deploymentStatusMessage
  );
  context.log(`Subscription Status: ${deploymentStatusMessage.status}`);
  context.log(`Incoming Subscription ID: ${deploymentStatusMessage.subscriptionId}`);

  try {
    const subscription = await Subscription.findById(deploymentStatusMessage.subscriptionId);

    subscription.status = deploymentStatusMessage.status;

    if (subscription.status === 'Deleted') {
      await Subscription.deleteOne({ _id: subscription._id });
    } else if (subscription.status === 'Running') {
      await subscription.save();
    }
  } catch (err) {
    context.log(`An error occured updating subscription status: ${err}`);
  }
};
