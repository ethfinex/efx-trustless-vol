const https = require('https');
const Web3 = require('web3')
const { ZeroEx } = require('0x.js')
const { web3ProviderUrl, efxExchangeAddress, networkId, blockPrecision } = require('./config')
const { wrapperToTokenMap, tokenInfo } = require('./tokenData')

const getBlockNumber24hAgo = async (_precision = blockPrecision) => {
  const web3 = new Web3(web3ProviderUrl)
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

const getTokenPrices = (tokens) => 
  new Promise((resolve, reject) => {
    https.get('https://api.ethfinex.com/v2/tickers?symbols=' + tokens.join(','), (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e.message);
        }
      });

    }).on("error", reject);
  })

const getDailyVolume = async () => {
  const blockNumber = await getBlockNumber24hAgo()

  const web3Provider = new Web3.providers.HttpProvider(web3ProviderUrl)
  const zeroEx = new ZeroEx(web3Provider, {
    networkId,
    exchangeContractAddress: efxExchangeAddress,
  })

  const logs = await zeroEx.exchange.getLogsAsync('LogFill', {
    fromBlock: blockNumber,
    toBlock: 'latest',
  }, {})

  const byToken = logs.reduce((collection, log) => {
    const { makerToken, filledMakerTokenAmount } = log.args
    if (collection[makerToken]) 
      collection[makerToken] = collection[makerToken].plus(filledMakerTokenAmount)
    else 
      collection[makerToken] = filledMakerTokenAmount
    return collection
  }, {})

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
    const tokenAmount = amount.times(10 ** (-1 * tokenInfo[tokenName].decimals))
    const tokenVolume = tokenPrices[tokenName] * tokenAmount
    totalVolume += tokenVolume
  })

  return totalVolume
}

module.exports = getDailyVolume
