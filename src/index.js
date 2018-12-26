startup = async () => {

  // connect to mongodb
  const mongodb = require('./lib/mongodb/connect')

  await mongodb(process.env.MONGODB_URI)

  // setup webserver
  const express = require('express')
  const path = require('path')

  const PORT = process.env.PORT || 5000

  const yesterday = require('./routes/api/v1/yesterday.json')
  const byDate = require('./routes/api/v1/byDate')

  express()
    .use(express.static(path.join(__dirname, 'public')))

    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/', (req, res) => res.render('pages/index'))

    .get('/api/v1/yesterday.json', yesterday )
    .get('/api/v1/date/:year/:month/:day', byDate )

    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  // schedules every day job
  const job = require('./everyDayJob.js')
  job()

  // cache previous days
  const cache = require('./cachePreviousDays')
  cache()

}

startup()
