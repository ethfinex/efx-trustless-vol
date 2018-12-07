const getTokenPrices = require('./lib/getTokenPrices')

const Web3 = require('web3')
const {ZeroEx} = require('0x.js')
const getConfig = require('./config')
const {wrapperToToken} = require('./tokenData')

const getBlockNumber24hAgo = async (_precision = 1) => {
  const config = await getConfig()
  const web3 = new Web3(config.web3ProviderUrl)

  let blockNumber = await web3.eth.getBlockNumber()

  const initialIncrement = 2000

  let increment = initialIncrement
  let currentTime = (new Date()).valueOf() / 1000
  let yesterday = currentTime - (24 * 60 * 60)

  while (currentTime > yesterday && currentTime - yesterday > 60) {
    blockNumber -= increment
    const block = await web3.eth.getBlock(blockNumber)
    currentTime = block.timestamp
    increment = Math.ceil((currentTime - yesterday) / (24 * 60 * 60) * initialIncrement)
    increment = Math.abs(increment)
    increment = Math.max(increment, _precision)
  }
  return blockNumber
}

const getDailyVolume = async () => {
  const config = await getConfig()
  const blockNumber = await getBlockNumber24hAgo()

  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)
  const zeroEx = new ZeroEx(web3Provider, {
    networkId: config.networkId,
    exchangeContractAddress: config.exchangeAddress,
  })

  const logs = await zeroEx.exchange.getLogsAsync('LogFill', {
    fromBlock: blockNumber,
    toBlock: 'latest',
  }, {})

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

  return totalVolume
}

module.exports = getDailyVolume
