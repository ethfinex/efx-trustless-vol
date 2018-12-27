const loki = require('./connect')

module.exports = (name) => {
  return loki.db.getCollection(name)
}

