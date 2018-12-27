const sleep = require('sleep-promise')
const cron = require('node-cron')

const moment = require('moment')

const cacheVolume = require('./lib/cache/cacheVolume')

module.exports = async () => {
  // every day
  cron.schedule('0 0 * * *', async () => {
    console.log( "Daily job running")
    console.log( " ---> date: ", moment.utc().format() )

    // cache result for previous day
    const day = moment().utc().date()
    const month = moment().utc().month()
    const year = moment().utc().year()

    const doc = await cacheVolume(day-1, month, year)

  })
}
