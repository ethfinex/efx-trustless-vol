const Web3 = require('web3')
const { ZeroEx } = require('0x.js')
const getConfig = require('./config')
const { wrapperToToken } = require('./tokenData')
const _ = require('lodash')

// To date (11th October)
// currency	Total
// ETH	0.16436611
// USD	39.21525191
// OMG	0.34448627
// ZRX	3.64373965
// SNT	3.81171475
// FUN	7.5
// NEC	0.06875

// 11th Sep - 11th Oct Block numbers: 6385294 - 6497244
// ETH 0.1723442800927430415
// USD 17.17079337375
// OMG 0.2892275
// ZRX 3.354499608875
// SNT 3.81171474001250005
// FUN 7.5
// NEC 0.06875
// (The actual fees are double this) - only 50% currently go to nectar holders


const startBlock = 6185294
const endBlock = 6497244

const get30dTrades = async () => {
  const config = await getConfig()

  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)
  const zeroEx = new ZeroEx(web3Provider, {
    networkId: config.networkId,
    exchangeContractAddress: config.exchangeAddress,
  })

  const logs = await zeroEx.exchange.getLogsAsync('LogFill', {
    fromBlock: startBlock,
    toBlock: endBlock,
  }, {})

  const wrapperToTokenMap = wrapperToToken(config.tokenRegistry)

  const byToken = logs.reduce((collection, log) => {
    const { takerToken, filledTakerTokenAmount } = log.args
    const tokenName = wrapperToTokenMap[takerToken]
    if (!tokenName) return
    if (collection[tokenName])
      collection[tokenName] = collection[tokenName].plus(filledTakerTokenAmount.div(2 * 400 * 10 ** config.tokenRegistry[tokenName].decimals))
    else
      collection[tokenName] = filledTakerTokenAmount.div( 400 * 10 ** config.tokenRegistry[tokenName].decimals)
    return collection
  }, {})
  _.each(byToken, function(value, key) {
    console.log(key, value.toString())
  })
}

get30dTrades()
