const mongodb = require('../../../lib/mongodb/connect')

module.exports = async (req, res) => {
  Stats = mongodb.db.collection('stats')

  const options = {
    fields: {
      _id: null
    },
    sort: {
      'volume.total': -1
    }
  }

  const doc = await Stats.findOne({}, options)

  res.setHeader('Content-Type', 'application/json');
  res.send(doc)
}
