const collection = require('../../../lib/loki/collection')

module.exports = async (req, res) => {
  Stats = collection('stats')

  /** mongodb way
  const options = {
    fields: {
      _id: null
    },
    sort: {
      'volume.total': -1
    }
  }

  const doc = await Stats.findOne({}, options)
  **/

  // ath using lokie.js
  doc = Stats.chain()
    .simplesort('volume.total', true)
    .offset(0)
    .limit(1)
    .data();

  console.log( "doc ->", doc )

  res.setHeader('Content-Type', 'application/json');
  res.send(doc)
}
