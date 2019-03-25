const Web3 = require('web3')
const { ExchangeWrapper } = require('@0x/contract-wrappers')
const { Web3Wrapper } = require('@0x/web3-wrapper')
const getConfig = require('./config')
const _ = require('lodash')

const startBlock = 6185294
const endBlock = 6497244

const get30dTrades = async () => {
  const config = await getConfig()

  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)
  const exchangeWrapper = new ExchangeWrapper(
    new Web3Wrapper(web3Provider),
    config.networkId,
    null,
    null,
    config.exchangeAddress,
  )

  const logs = await exchangeWrapper.getLogsAsync('Fill', {
    fromBlock: startBlock,
    toBlock: endBlock,
  }, {})
  console.log(logs)
}

get30dTrades()
