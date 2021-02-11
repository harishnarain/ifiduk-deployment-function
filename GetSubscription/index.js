const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Subscription = require('../models/Subscription');
  const Organization = require('../models/Organization');
  db();

  context.log('Getting Subscriptions...');

  // Generate query
  let query = '';

  if (req.query.name) {
    //query = new RegExp('^' + req.query.name, 'i');
    query = req.query.name.toLowerCase();
  }

  // Get subscriptions based on orgId
  // Temporarily use static userIdentifier instead of claims for dev
  const userIdentifier = '05d0ae08-ecb9-4054-9025-90410ac6f164';

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
    context.log(err);
    return {
      status: 500,
      body: 'An error occured processing requests.',
    };
  }
};
