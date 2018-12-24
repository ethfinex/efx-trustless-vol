const {get} = require('request-promise')

module.exports = (symbol, dayTimestamp) => {
  let url = 'https://api.bitfinex.com/v2/candles/trade:1D:' + symbol
  url = url + '/hist?limit=1&end=' + dayTimestamp

  return get(url, {json: true})
}
