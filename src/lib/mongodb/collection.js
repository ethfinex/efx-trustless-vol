const mongodb = require('./connect')

module.exports = (collection) => {
  return mongodb.db.collection(collection)
}
