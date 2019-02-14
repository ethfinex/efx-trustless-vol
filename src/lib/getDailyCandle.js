const sleep = require('sleep-promise')
const {get} = require('request-promise')

module.exports = async (symbol, dayTimestamp) => {
  let url = 'https://api.bitfinex.com/v2/candles/trade:1D:' + symbol
  url = url + '/hist?limit=1&end=' + dayTimestamp

  let retries = 0

  while(true) {

    try {
      return await get(url, {json: true})
    } catch(e) {

      console.log("")
      console.log("error getting daily candle for: ", symbol)
      console.log(e)

      if(retries > 2){
        throw(e)
      }
    }

    console.log("retrying in 500ms")
    console.log("")

    retries += 1
    await sleep(500)
  }

}
