const cron = require('node-cron')
const moment = require('moment')

module.exports = () => {
  cron.schedule('1 0 * * *', async () => {
    console.log( "cron job running")
    console.log( " ---> date: ", moment.utc().format() )
  })
}
