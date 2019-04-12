const moment = require('moment')
const getDailyVolume = require('../getDailyVolume')
const cache = require('../cache/cache')
const cacheVolumeByTimestamp = require('./cacheVolumeByTimestamp')

module.exports = (day, month, year) => {

  const date = moment.utc()
    .year(year)
    .month(month)
    .date(day)
    .hours(0)
    .minutes(0)
    .seconds(0)

  const timestamp = date.unix()

  return cacheVolumeByTimestamp(timestamp)

}
