const {get} = require('request-promise')

module.exports = (tokens) => {
  const url = 'https://api.ethfinex.com/v2/tickers?symbols=' + tokens.join(',')

  return get(url, {json: true})
}
