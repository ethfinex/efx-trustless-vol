const Web3 = require('web3')
const getConfig = require('../config')
const blockByTime = require('./getBlockByTime')
const getTokenPrices = require('./getTokenPrices')
const {ZeroEx} = require('0x.js')
const wrapperToToken = require('./wrapperToToken')
const toDate = require('./timestampToDate')

module.exports = async (dayTimestamp) => {

  // calculate from and toBlock
  const fromBlock = await blockByTime(dayTimestamp)
  const toBlock = await blockByTime(dayTimestamp + 24 * 60 * 60)

  // request logs from zeroEx
  const config = await getConfig()
  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)

  const zeroEx = new ZeroEx(web3Provider, {
    networkId: config.networkId,
    exchangeContractAddress: config.exchangeAddress,
  })

  const range = {
    fromBlock: fromBlock.number,
    toBlock: toBlock.number
  }

  const logs = await zeroEx.exchange.getLogsAsync('LogFill', range, {})

  const byToken = logs.reduce((collection, log) => {
    const {makerToken, filledMakerTokenAmount} = log.args
    if (collection[makerToken])
      collection[makerToken] = collection[makerToken].plus(filledMakerTokenAmount)
    else
      collection[makerToken] = filledMakerTokenAmount
    return collection
  }, {})

  const wrapperToTokenMap = wrapperToToken(config.tokenRegistry)

  const tokens = Object.keys(byToken)
    .map(token => wrapperToTokenMap[token])
    .filter(token => token !== 'USD')
    .map(token => `t${token}USD`)

  const tokenApiData = await getTokenPrices(tokens)
  const tokenPrices = tokenApiData.reduce((prices, data) => {
    const tokenName = data[0].substr(1, 3)
    const tokenPrice = data[7]
    prices[tokenName] = tokenPrice
    return prices
  }, {})

  tokenPrices['USD'] = 1

  let totalVolume = 0

  Object.entries(byToken).forEach(([address, amount]) => {
    const tokenName = wrapperToTokenMap[address]
    if (!tokenName) return
    const tokenAmount = amount.times(10 ** (-1 * config.tokenRegistry[tokenName].decimals))
    const tokenVolume = tokenPrices[tokenName] * tokenAmount
    totalVolume += tokenVolume
  })

  const result = {
    fromBlock: {
      number: fromBlock.number,
      timestamp: fromBlock.timestamp,
      date: toDate(fromBlock.timestamp)
    },
    toBlock: {
      number: toBlock.number,
      timestamp: toBlock.timestamp,
      date: toDate(toBlock.timestamp)
    },
    volume: totalVolume
  }

  return result
}
