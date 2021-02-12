const db = require('../config/dbConfig');

exports.getOrganizations = async (req, res) => {
  const Organization = require('../models/Organization');
  db();

  req.context.log('Getting Organization...');

  // Check if organization name exists
  const userIdentifier = req.authInfo.oid;

  // Find oid in organizations collections name field
  try {
    const org = await Organization.findOne({ name: userIdentifier });
    if (org) {
      return {
        status: 200,
        body: {
          _id: org._id,
          name: org.name,
          technicalContact: org.technicalContact,
          subscriptions: org.subscriptions,
        },
      };
    }

    return {
      status: 404,
      body: 'No organization found!',
    };
  } catch (err) {
    return {
      status: 500,
      body: 'An error occured processing requests.',
    };
  }
};
