const sleep = require('sleep-promise')
const cron = require('node-cron')
const moment = require('moment')
const cache = require('./lib/mongodb/cacheVolume')

module.exports = async () => {
  console.log('caching previous days')

  // start caching volume for previous days
  const day = moment().utc().date()
  const month = moment().utc().month()
  const year = moment().utc().year()

  const limit = 90// 90 days

  for(var offset=1; offset<limit;offset++){

    console.log( "caching ->", day-offset, month, year)

    const cached = await cache(day-offset, month, year)

    // sleep 1 second between cycles
    await sleep(1000)
  }
}
