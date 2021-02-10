const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Subscription = require('../models/Subscription');
  db();

  context.log('Getting Subscriptions...');

  // Generate query
  let query = '';

  if (req.query.name) {
    query = new RegExp('^' + req.query.name, 'i');
  }

  try {
    let subscriptions;
    if (query) {
      subscriptions = await Subscription.find({ name: { $regex: query } });
    } else {
      subscriptions = await Subscription.find();
    }
    context.log(subscriptions);

    return {
      status: 200,
      body: subscriptions,
    };
  } catch (err) {
    return {
      status: 400,
      body: 'Error getting subscriptions!',
    };
  }
};
