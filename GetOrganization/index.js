const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Organization = require('../models/Organization');
  db();

  context.log('Getting Organization...');

  // Check if organization name exists
  // Extract email from user claims
  // Temporarily providing in query params for dev
  let email;
  if (req.query.email) {
    email = req.query.email;
  } else {
    return {
      status: 400,
      body: 'No query parameter found!',
    };
  }

  // Find email in organizations collections name field
  try {
    const org = await Organization.findOne({ name: email });
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
