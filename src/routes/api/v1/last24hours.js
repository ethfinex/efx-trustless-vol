const moment = require('moment')
const cacheVolumeByTimestamp = require('../../../lib/cache/cacheVolumeByTimestamp')
const collection = require('../../../lib/mongodb/collection')

module.exports = async (req, res) => {
  const day = moment().utc().date()
  const month = moment().utc().month()
  const year = moment().utc().year()

  const date = moment.utc()
    .year(year)
    .month(month)
    .date(day-1)

  const timestamp = date.unix()

  Stats = collection('stats')

  // when using mongo we dont want to show the id
  const sort = {timestamp: -1}

  const cursor = await Stats.find()
    .limit(1)
    .sort({timestamp: -1})
    .toArray()

  doc = cursor[0]

  now = moment.utc()
  cache_time = moment.utc(doc.timestamp * 1000)

  // time the last 24 hours volume was calculated
  let difference = moment.duration(now.diff(cache_time)).asMinutes()

  // remove 24 hours
  difference -= 24 * 60

  let response

  // if difference between last calculation is less than 10 minutes
  // return the calculation
  if(difference <= 10) {

    // returning cached 24 hours volume because it's less than 10 minutes
    console.log( "10 minutes cache !")
    response = doc
  } else {
    console.log( "calculating volume again")
    response = await cacheVolumeByTimestamp(timestamp)
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(response)
}
