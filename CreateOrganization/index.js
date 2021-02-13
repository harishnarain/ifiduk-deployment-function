const db = require('../config/dbConfig');

module.exports = async function (context, req) {
  const Organization = require('../models/Organization');
  db();

  const API_VERSION = '1.0.0';

  // parse Basic Auth username and password
  const header = req.headers['authorization'] || '', // get the header
    token = header.split(/\s+/).pop() || '', // and the encoded auth token
    auth = new Buffer.from(token, 'base64').toString(), // convert from base64
    parts = auth.split(/:/), // split on colon
    username = parts[0],
    password = parts[1];

  // Check for HTTP Basic Authentication, return HTTP 401 error if invalid credentials.
  if (
    username !== process.env['BASIC_AUTH_USERNAME'] ||
    password !== process.env['BASIC_AUTH_PASSWORD']
  ) {
    context.res = {
      status: 401,
    };
    context.log('Invalid Authentication');
    return;
  }

  context.log('Creating Organization...');

  // Check if organization name already exits
  // Extract oid from user claims
  // Temporarily providing in request body for dev
  if (!req.body) {
    context.res = {
      status: 400,
      body: {
        version: API_VERSION,
        action: 'ShowBlockPage',
        userMessage: 'A request body is required!',
        status: 400,
      },
    };
  }

  const userIdentifier = req.body.email;
  const email = req.body.email.toLowerCase();

  // Find oid in organizations collections name field
  let org;
  try {
    org = await Organization.findOne({ name: userIdentifier });
  } catch (err) {
    context.res = {
      status: 500,
      body: {
        version: API_VERSION,
        action: 'ShowBlockPage',
        userMessage: 'An error occurred processing requests.',
        status: 500,
      },
    };
  }

  // Create org name if one doesn't already exist
  if (!org) {
    // Generate org object
    const newOrg = {
      name: userIdentifier,
      technicalContact: email,
    };
    try {
      const { _id, name, technicalContact } = await Organization.create(newOrg);
      context.res = {
        status: 201,
        body: {
          version: API_VERSION,
          action: 'Continue',
        },
      };
    } catch (err) {
      context.res = {
        status: 500,
        body: {
          version: API_VERSION,
          action: 'ShowBlockPage',
          userMessage: 'Error creating organization!',
          status: 500,
        },
      };
    }
  }

  // context.res = {
  //   status: 409,
  //   body: {
  //     version: API_VERSION,
  //     action: 'ShowBlockPage',
  //     userMessage: `Organization ${req.body.oid} already exists!`,
  //     status: 409,
  //   },
  // };
};
