const mongoose = require('mongoose');

let dbInstance;

module.exports = async () => {
  if (!dbInstance) {
    mongoose.connect(process.env.MongoDbConnectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', (err) => {
      context.log(`[ERROR]: ${err.message}`);
    });
  }

  return dbInstance;
};
