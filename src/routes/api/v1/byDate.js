const moment = require('moment')
const getDailyVolume = require('../../../lib/getDailyVolume')
const cache = require('../../../lib/cache')

module.exports = async (req, res) => {
  const day = Number(req.params.day)
  const month = Number(req.params.month) - 1
  const year = Number(req.params.year)

  const startOfTheDay = moment.utc()
    .year(year)
    .month(month)
    .date(day)
    .hours(0)
    .minutes(0)
    .seconds(0)

  const timestamp = startOfTheDay.unix()

  const cached = await cache(
    'daily-volume:' + timestamp,
    () => getDailyVolume(timestamp)
  )

  res.setHeader('Content-Type', 'application/json');
  res.send(cached)
}
