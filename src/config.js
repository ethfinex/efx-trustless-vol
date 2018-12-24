const {post} = require('request-promise')

let config = {
  networkId: 1,
  web3ProviderUrl: 'https://mainnet.infura.io/BtvoqcA5JxbDnMC5gHYL',
  configUrl: 'https://api.ethfinex.com/trustless/v1/r/get/conf',
  exchangeAddress: '', // fetched from the API
  tokenRegistry: {}, // fetched from the API
}

let cached = false

module.exports = async () => {
  if(cached) {
    return config
  }

  const efxConfig = await post(config.configUrl, {json: {}})

  cached = true

  config = {
    ...config,
    ...efxConfig['0x'],
  }

  return config
}
