/* eslint-env mocha */

const {assert} = require('chai')

const getConfig = require('../src/config.js')
const getDailyVolume = require('../src/index')

describe('~ efx-trustless-vol', async () => {

  it('config is being fetched from ethfinex api', async () => {
    const config = await getConfig()

    // assert tokenRegistry contains tokens
    assert.ok(Object.keys(config.tokenRegistry))

    // TODO: test more conditions to validate if config is being fetched
    // correctly
  })

  it('get block number for 24 hours ago', async () => {
    const volume = await getDailyVolume()

    console.log( "vol ->", volume)

    // TODO: refactor ./src/index file, break into functions with
    // better parameters so we can develop other features on this
    // application
    assert.ok(volume)
  })
})
