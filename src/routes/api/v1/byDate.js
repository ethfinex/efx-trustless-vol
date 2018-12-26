const moment = require('moment')
const cacheVolume = require('../../../lib/mongodb/cacheVolume')

module.exports = async (req, res) => {
  const day = Number(req.params.day)
  const month = Number(req.params.month) - 1
  const year = Number(req.params.year)

  const cached = await cacheVolume(day, month, year)

  res.setHeader('Content-Type', 'application/json');
  res.send(cached)
}
