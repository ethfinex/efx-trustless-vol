const moment = require('moment')
const getDailyVolume = require('../getDailyVolume')
const cache = require('./cache')

// 13th of September 2018
const firstDay = moment.utc().year(2018).month(8).date(13)

module.exports = (day, month, year) => {

  // current date
  const today = moment.utc().startOf('day')

  const date = moment.utc()
    .year(year)
    .month(month)
    .date(day)
    .hours(0)
    .minutes(0)
    .seconds(0)

  const timestamp = date.unix()

  if(timestamp < firstDay.unix()){
    return { error: 'date_is_too_early' }
  }

  if(timestamp >= today.unix()){
    return { error: 'day_must_be_complete' }
  }

  const query = {timestamp}

  return cache(query, () => getDailyVolume(timestamp))
}
