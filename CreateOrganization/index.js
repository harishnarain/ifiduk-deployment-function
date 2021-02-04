const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Organization = require('../models/Organization');
  db();

  context.log('Creating Organization...');

  // Check if organization name already exits
  // Extract email from user claims
  // Temporarily providing in request body for dev

  // Find email in organizations collections name field

  // Create org name if one doesn't already exist
};
