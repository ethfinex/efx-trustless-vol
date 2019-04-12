const moment = require('moment')
const cacheVolumeByTimestamp = require('../../../lib/cache/cacheVolumeByTimestamp')

module.exports = async (req, res) => {
  const day = moment().utc().date()
  const month = moment().utc().month()
  const year = moment().utc().year()

  const date = moment.utc()
    .year(year)
    .month(month)
    .date(day-1)

  const timestamp = date.unix()

  const cached = await cacheVolumeByTimestamp(timestamp)

  res.setHeader('Content-Type', 'application/json');
  res.send(cached)
}
