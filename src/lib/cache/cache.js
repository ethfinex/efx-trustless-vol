const collection = require('../mongodb/collection')

module.exports = async (query, value) => {

  Stats = collection('stats')

  // when using mongo we dont want to show the id
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

  if(doc){
    // when using loki we don't want to show $loki and meta
    delete doc['$loki']
    delete doc.meta
  }

  return doc
}
