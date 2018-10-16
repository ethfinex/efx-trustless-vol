const https = require('https');
const Web3 = require('web3')
const { ZeroEx } = require('0x.js')
const { web3ProviderUrl, efxExchangeAddress, networkId, blockPrecision } = require('./config')
const { wrapperToTokenMap, tokenInfo } = require('./tokenData')
const _ = require('lodash')


const startBlock = 6185294
const endBlock = 6497244

const get30dTrades = async () => {

  const web3Provider = new Web3.providers.HttpProvider(web3ProviderUrl)
  const zeroEx = new ZeroEx(web3Provider, {
    networkId,
    exchangeContractAddress: efxExchangeAddress,
  })

  const logs = await zeroEx.exchange.getLogsAsync('LogFill', {
    fromBlock: startBlock,
    toBlock: endBlock,
  }, {})
  console.log(logs)
}

get30dTrades()
