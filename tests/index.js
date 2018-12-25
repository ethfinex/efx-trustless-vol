/* eslint-env mocha */
const {assert} = require('chai')

const getConfig = require('../src/config.js')
const getBlockByTime = require('../src/lib/getBlockByTime')
const getDailyVolume = require('../src/lib/getDailyVolume')
const moment = require('moment')

describe('~ efx-trustless-vol', async () => {

  it('config is being fetched from ethfinex api', async () => {
    const config = await getConfig()

    // assert tokenRegistry contains tokens
    assert.ok(Object.keys(config.tokenRegistry))

    // TODO: test more conditions to validate if config is being fetched
    // correctly
  })

  it('get block by time', async () => {
    const currentDay = moment().utc().date()
    const currentMonth = moment().utc().month()
    const currentYear = moment().utc().year()

    const startOfToday = moment.utc().startOf('day')
    const startOfYesterday = moment.utc()
      .year(currentYear)
      .month(currentMonth)
      .date(currentDay-1)
      .hours(0)
      .minutes(0)
      .seconds(0)

    //const block = await getBlockByTime(startOfToday.unix())
    const block = await getBlockByTime(startOfYesterday.unix())

    assert.ok(block)
  })

  it('get yesterday daily volume', async () => {
    const currentDay = moment().utc().date()
    const currentMonth = moment().utc().month()
    const currentYear = moment().utc().year()

    const startOfYesterday = moment.utc()
      .year(currentYear)
      .month(currentMonth)
      .date(currentDay-1)
      .hours(0)
      .minutes(0)
      .seconds(0)

    const result = await getDailyVolume(startOfYesterday.unix())

    assert.ok(result.fromBlock)
    assert.ok(result.toBlock)
    assert.ok(result.volume)
    assert.ok(result.volume.symbols)
  })

})
