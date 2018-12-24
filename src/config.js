const {ZeroEx} = require('0x.js')
const Web3 = require('web3')
const {post} = require('request-promise')
const wrapperToToken = require('./lib/wrapperToToken')

let config = {
  networkId: 1,
  web3ProviderUrl: 'https://mainnet.infura.io/BtvoqcA5JxbDnMC5gHYL',
  configUrl: 'https://api.ethfinex.com/trustless/v1/r/get/conf',
  tokenMap: {}, // maps tokenAddress to token symbol
  exchangeAddress: '', // fetched from the API
  tokenRegistry: {}, // fetched from the API
}

let cached = false

module.exports = async (reload = false) => {
  // only fetch config once per execution
  if(cached && !reload) {
    return config
  }

  const efxConfig = await post(config.configUrl, {json: {}})

  cached = true

  config = {
    ...config,
    ...efxConfig['0x'],
  }

  config.tokenMap = wrapperToToken(config.tokenRegistry)

  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)

  config.zeroEx = new ZeroEx(web3Provider, {
    networkId: config.networkId,
    exchangeContractAddress: config.exchangeAddress,
  })

  return config
}
