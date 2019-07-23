const getConfig = require('../config')
const blockByTime = require('./getBlockByTime')
const getTokenPrices = require('./getTokenPrices')
const getDailyCandle = require('./getDailyCandle')
const toDate = require('./timestampToDate')
const { assetDataUtils } = require('@0x/order-utils')
const moment = require('moment')

module.exports = async (dayTimestamp) => {

  // fetches basic app config / info
  const config = await getConfig()

  //console.log( "looking for fromBlock" )

  // calculate from and toBlock
  const fromBlock = await blockByTime(dayTimestamp, dayTimestamp)

  //console.log( "fromBlock ->", fromBlock )

  const nextDayTimestamp = dayTimestamp + 24 * 60 * 60

  const toBlock = await blockByTime(nextDayTimestamp, null, nextDayTimestamp)

  const range = {
    fromBlock: fromBlock.number,
    toBlock: toBlock.number
  }

  let exchangeWrapper = config.exchangeWrapper
  let tokenMap = config.tokenMap

  if(dayTimestamp < config.previousVersionDate.unix()){

    console.log("using old exchangeWrapper")
    exchangeWrapper = config.previousExchangeWrapper
    tokenMap = config.previousTokenMap
  }

  // request logs from zeroEx
  const logs = await exchangeWrapper.getLogsAsync(
    'Fill',
    range,
    {feeRecipientAddress: config.ethfinexAddress}
  )

  // sums all filled "amounts" by token
  const volumeByAddress = logs.reduce((collection, log) => {
    const {makerAssetData, makerAssetFilledAmount} = log.args
    const makerToken = assetDataUtils.decodeERC20AssetData(makerAssetData).tokenAddress

    if (collection[makerToken])
      collection[makerToken] = collection[makerToken].plus(makerAssetFilledAmount)
    else
      collection[makerToken] = makerAssetFilledAmount

    return collection
  }, {})

  // get close price of the daily candle for each token in USD
  const tokensAddresses = Object.keys(volumeByAddress)

  const tokens = tokensAddresses.map(token => tokenMap[token])
    .filter(token => {
      return ( token !== 'USD' ) && ( token !== 'DAI' ) && ( token !== 'USC' )
    })

  //console.log( "token addresses ->", tokensAddresses )
  //console.log( "tokens          ->", tokens )

  const prices = {USD: 1, DAI: 1, USC: 1}

  for(let token of tokens){

    const price = await getDailyCandle(`t${token}USD`, dayTimestamp * 1000)

    if(!price.length){
      console.log( `price not found for ${token}`)
      continue
    }

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
    const symbol = tokenMap[address]

    if(!config.tokenRegistry[symbol]){
      console.log(`registry not found for ${symbol}, might have been delisted?`)
      continue
    }

    const decimals = config.tokenRegistry[symbol].decimals
    const price  = prices[symbol]

    if(!price){
      console.log(`price not found for ${symbol}, might have been delisted?`)
      continue
    }

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
