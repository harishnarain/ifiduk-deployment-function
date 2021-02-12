const express = require('express');
const createHandler = require('azure-function-express').createHandler;
const passport = require('passport');
const app = express();
app.use(require('body-parser').urlencoded({ extended: true }));

const { createProduct } = require('../controllers/ProductController');
const auth = require('../config/auth.json');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const options = {
  identityMetadata: `https://${auth.credentials.tenantName}.b2clogin.com/${auth.credentials.tenantName}.onmicrosoft.com/${auth.policies.policyName}/${auth.metadata.version}/${auth.metadata.discovery}`,
  clientID: auth.credentials.clientID,
  audience: auth.credentials.clientID,
  policyName: auth.policies.policyName,
  isB2C: auth.settings.isB2C,
  validateIssuer: auth.settings.validateIssuer,
  loggingLevel: auth.settings.loggingLevel,
  passReqToCallback: auth.settings.passReqToCallback,
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
});

app.use(passport.initialize());

passport.use(bearerStrategy);

app.post(
  '/api/products',
  passport.authenticate('oauth-bearer', { session: false }),
  async (req, res) => {
    try {
      const product = await createProduct(req, res);
      res.status(product.status).json(product.body);
    } catch (err) {
      res.status(err.status).json(err.body);
    }
  }
);

module.exports = createHandler(app);
