const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Organization = require('../models/Organization');
  db();

  context.log('Creating Organization...');

  // Check if organization name already exits
  // Extract email from user claims
  // Temporarily providing in request body for dev
  const email = req.body.email;

  // Find email in organizations collections name field
  const org = await Organization.findOne({ name: email });

  // Create org name if one doesn't already exist
  if (!org) {
    // Generate org object
    const newOrg = {
      name: email,
      technicalContact: email,
    };
    try {
      const { _id, name, technicalContact } = await Organization.create(newOrg);
      return {
        status: 201,
        body: {
          _id: _id,
          name: name,
          technicalContact: technicalContact,
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: 'Error creating organization!',
      };
    }
  }

  return {
    status: 409,
    body: 'Organization already exists!',
  };
};
