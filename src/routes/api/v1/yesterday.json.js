const moment = require('moment')
const cache = require('../../../lib/cache')
const getDailyVolume = require('../../../lib/getDailyVolume')

module.exports = async (req, res) => {
  const day = moment().utc().date()
  const month = moment().utc().month()
  const year = moment().utc().year()

  const startOfYesterday = moment.utc()
    .year(year)
    .month(month)
    .date(day-1)
    .hours(0)
    .minutes(0)
    .seconds(0)

  const timestamp = startOfYesterday.unix()

  const cached = await cache(
    'daily-volume:' + timestamp,
    () => getDailyVolume(timestamp)
  )

  res.setHeader('Content-Type', 'application/json');
  res.send(cached)
}
