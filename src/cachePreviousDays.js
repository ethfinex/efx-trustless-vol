const sleep = require('sleep-promise')
const cron = require('node-cron')
const moment = require('moment')
const cache = require('./lib/cache/cacheVolume')

module.exports = async () => {
  console.log('caching previous days')

  // start caching volume for previous days
  const day = moment().utc().date()
  const month = moment().utc().month()
  const year = moment().utc().year()

  // TODO: limit to do it until 13th of September 2018
  const firstDay = moment.utc().year(2018).month(8).date(13)
  const limit = 365 // hard limit just in case

  for(var offset=1; offset < limit;offset++){

    const date = moment.utc()
      .year(year)
      .month(month)
      .date(day-offset)
      .hours(0)
      .minutes(0)
      .seconds(0)

    const timestamp = date.unix()

    if(timestamp < firstDay.unix()){
      break
    }

    console.log( "checking cache on ->", date.format("YYYY-MM-DD") )

    const cached = await cache(day-offset, month, year)

    // sleep 1 second between cycles
    await sleep(100)
  }
}
