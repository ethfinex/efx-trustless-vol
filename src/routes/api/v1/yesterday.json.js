const moment = require('moment')
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

  res.setHeader('Content-Type', 'application/json');
  res.send(await getDailyVolume(startOfYesterday.unix()))
}
