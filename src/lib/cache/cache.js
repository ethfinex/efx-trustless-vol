const collection = require('../loki/collection')

module.exports = async (query, value) => {

  Stats = collection('stats')

  // when using mongo we dont want to show the id
  const options = {
    fields: {
      _id: false
    }
  }

  let doc = await Stats.findOne(query, options)

  if(doc){
    // when using loki we don't want to show $loki and meta
    delete doc['$loki']
    delete doc.meta
  }

  if(!doc) {
    doc = await value()

    Stats.insert(doc)
  }

  return doc
}
