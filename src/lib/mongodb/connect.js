var MongoClient, options;

MongoClient = require('mongodb').MongoClient;

options = {
  useNewUrlParser: true
};

module.exports = (url) => {
  return new Promise(function(resolve, reject) {
    if (module.exports.db) {
      resolve(module.exports.db);
    }
    return MongoClient.connect(url, options, function(error, db) {
      if (error) {
        reject(error);
      }

      module.exports.db = db.db()

      return resolve(db);
    });
  });
};
