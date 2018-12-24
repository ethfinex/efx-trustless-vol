const moment = require('moment')
const getDailyVolume = require('../../../lib/getDailyVolume')

module.exports = async (req, res) => {
  const day = Number(req.params.day)
  const month = Number(req.params.month) - 1
  const year = Number(req.params.year)

  const startOfYesterday = moment.utc()
    .year(year)
    .month(month)
    .date(day)
    .hours(0)
    .minutes(0)
    .seconds(0)

  res.setHeader('Content-Type', 'application/json');
  res.send(await getDailyVolume(startOfYesterday.unix()))
}
