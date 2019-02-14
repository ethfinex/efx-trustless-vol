const getConfig = require('../config')
const blockByTime = require('./getBlockByTime')
const getTokenPrices = require('./getTokenPrices')
const getDailyCandle = require('./getDailyCandle')
const toDate = require('./timestampToDate')

module.exports = async (dayTimestamp) => {

  // fetches basic app config / info
  const config = await getConfig()

  // calculate from and toBlock
  const fromBlock = await blockByTime(dayTimestamp, dayTimestamp)

  const nextDayTimestamp = dayTimestamp + 24 * 60 * 60

  const toBlock = await blockByTime(nextDayTimestamp, null, nextDayTimestamp)

  const range = {
    fromBlock: fromBlock.number,
    toBlock: toBlock.number
  }

  // request logs from zeroEx
  const logs = await config.zeroEx.exchange.getLogsAsync('LogFill', range, {})

  // sums all filled "amounts" by token
  const volumeByAddress = logs.reduce((collection, log) => {
    const {makerToken, filledMakerTokenAmount} = log.args

    if (collection[makerToken])
      collection[makerToken] = collection[makerToken].plus(filledMakerTokenAmount)
    else
      collection[makerToken] = filledMakerTokenAmount

    return collection
  }, {})

  // get close price of the daily candle for each token in USD
  const tokens = Object.keys(volumeByAddress)
    .map(token => config.tokenMap[token])
    .filter(token => {
      return ( token !== 'USD' ) && ( token !== 'DAI' )
    })

  prices = {USD: 1, DAI: 1}

  for(let token of tokens){
    const price = await getDailyCandle(`t${token}USD`, dayTimestamp * 1000)

    // get close price of the candle
    prices[token] = price[0][2]
  }

  let totalVolume = 0

  // total volume of all tokens in USD
  let volume = {
    total: 0,
    symbols: {}
  }
  // calculate total by token and also add to the total volume
  for(var address in volumeByAddress){
    const symbol = config.tokenMap[address]
    const decimals = config.tokenRegistry[symbol].decimals
    const price  = prices[symbol]
    const amount = volumeByAddress[address].times(10 ** (-1 * decimals)).toNumber()

    volume.symbols[symbol] = {
      usdPrice : price,
      amount : amount,
      total : price * amount
    }

    volume.total += volume.symbols[symbol].total
  }

  return {
    date: toDate(dayTimestamp),

    timestamp: (dayTimestamp),

    volume: volume,

    fromBlock: {
      number: fromBlock.number,
      timestamp: fromBlock.timestamp,
      date: toDate(fromBlock.timestamp)
    },

    toBlock: {
      number: toBlock.number,
      timestamp: toBlock.timestamp,
      date: toDate(toBlock.timestamp)
    }
  }
}
