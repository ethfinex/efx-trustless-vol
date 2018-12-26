const sleep = require('sleep-promise')
const cron = require('node-cron')

const moment = require('moment')

module.exports = async () => {
  // every day
  cron.schedule('0 0 * * *', async () => {
    console.log( "Daily job running")
    console.log( " ---> date: ", moment.utc().format() )

    // start caching volume for previous days
    const day = moment().utc().date()
    const month = moment().utc().month()
    const year = moment().utc().year()
  })
}
