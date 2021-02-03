const seeder = require('mongoose-seed');

const db = 'mongodb://root:lanier@localhost:27017/ifidukDB?authSource=admin';

const data = [
  {
    model: 'Product',
    documents: [
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
    ],
  },
];

seeder.connect(db, function () {
  seeder.loadModels(['./models/Product.js']);

  seeder.clearModels(['Product'], function () {
    seeder.populateModels(data, function (err, done) {
      if (err) {
        return console.log('seed error', err);
      }

      if (done) {
        return console.log('seed complete', done);
      }

      seeder.disconnect();
    });
  });
});
