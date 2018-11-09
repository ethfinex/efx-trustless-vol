const https = require('https');
const Web3 = require('web3')
const { ZeroEx } = require('0x.js')
const getConfig = require('./config')
const _ = require('lodash')


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
  console.log(logs)
}

get30dTrades()
