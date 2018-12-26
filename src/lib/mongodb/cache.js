const mongodb = require('./connect')

module.exports = async (query, value) => {

  Stats = mongodb.db.collection('stats')

  const options = {
    fields: {
      _id: false
    }
  }

  let doc = await Stats.findOne(query, options)

  if(!doc) {
    doc = await value()

    Stats.insertOne(doc)
  }

  return doc
}
