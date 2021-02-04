const mongoose = require('mongoose');

const Product = require('../models/Product');
const Organization = require('../models/Organization');
const Subscription = require('../models/Subscription');

mongoose.connect('mongodb://root:lanier@localhost/ifidukDB?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  context.log(`[ERROR]: ${err.message}`);
});

const products = [
  {
    name: 'testproduct1',
    description: 'This is Test Product 1',
  },
  {
    name: 'testproduct2',
    description: 'This is Test Product 2',
  },
  {
    name: 'testproduct3',
    description: 'This is Test Product 3',
  },
  {
    name: 'testproduct4',
    description: 'This is Test Product 4',
  },
  {
    name: 'testproduct5',
    description: 'This is Test Product 5',
  },
];

const organizations = [
  {
    name: 'sam@contoso.com',
    technicalContact: 'sam@contoso.com',
  },
  {
    name: 'john@fabrikam.com',
    technicalContact: 'john@fabrikam.com',
  },
];

const getRandomNumber = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const seedProducts = async () => {
  // Drop products collection
  console.log('\nDropping products collection...\n');
  await Product.collection.drop();

  // Iterate through each product and add to products collection
  for (const product of products) {
    try {
      const { _id, name, description } = await Product.create(product);
      console.log(
        `[Seeded Product]: ${JSON.stringify({
          _id: _id,
          name: name,
          description: description,
        })}`
      );
    } catch (err) {
      console.error(`[Error]: ${err}`);
    }
  }
};

const seedOrgs = async () => {
  // Drop organizations collection
  console.log('\nDropping organizations collection...\n');
  await Organization.collection.drop();

  // Iterate through each organization and add to organizations collection
  for (const org of organizations) {
    try {
      const { _id, name, technicalContact } = await Organization.create(org);
      console.log(
        `[Seeded Org]: ${JSON.stringify({
          _id: _id,
          name: name,
          technicalContact: technicalContact,
        })}`
      );
    } catch (err) {
      console.error(`[Error]: ${err}`);
    }
  }
};

const generateSubscriptionName = (currOrgName) => {
  // Clean org name
  const newOrgNamePrefix = currOrgName.replace(/@|\.|_/gi, '-');

  // Generate name with cleaned orgname and random number
  const newOrgNameSuffix = Math.floor(Math.random() * (9999 - 1000) + 1000);
  return `${newOrgNamePrefix}-${newOrgNameSuffix}`;
};

const seedSubs = async () => {
  // Drop subscriptions collection
  console.log('\nDropping subscriptions collection...\n');
  await Subscription.collection.drop();

  // Get all orgs
  const orgs = await Organization.find();

  // For each org
  for (const org of orgs) {
    // Get all products and store in array
    const products = await Product.find();

    // Randomly select a product from products array
    const product = products[getRandomNumber(products.length)];

    // Generate subscription name
    const subscriptionName = generateSubscriptionName(org.name);

    // Create a subscription with randomly selected product
    try {
      const { _id, name, productId, orgId } = await Subscription.create({
        name: subscriptionName,
        productId: product._id,
        orgId: org._id,
      });
      await Organization.findByIdAndUpdate(orgId, { $push: { subscriptions: _id } }, { new: true });
      console.log(
        `[Seeded Subscription]: ${JSON.stringify({
          _id: _id,
          name: name,
          productId: productId,
          orgId: orgId,
        })}`
      );
    } catch (err) {
      console.error(`[Error]: ${err}`);
    }
  }
};

const testPopulate = async () => {
  try {
    const populatedOrgs = await Organization.find().populate('subscriptions');
    console.log(`\n[Populated Orgs]: ${JSON.stringify(populatedOrgs)}`);
  } catch (err) {
    console.error(`[Error]: ${err}`);
  }
};

const seed = async () => {
  console.log('\nSeeding Database...\n');

  await seedProducts();
  await seedOrgs();
  await seedSubs();
  //await testPopulate();
  mongoose.connection.close();
};

seed();
