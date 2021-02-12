const db = require('../config/dbConfig');

exports.getSubscriptions = async (req, res) => {
  const Subscription = require('../models/Subscription');
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
    context.log(err);
    return {
      status: 500,
      body: 'An error occured processing requests.',
    };
  }
};
