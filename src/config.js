const {post} = require('request-promise')

const config = {
  networkId: 1,
  web3ProviderUrl: 'https://mainnet.infura.io/BtvoqcA5JxbDnMC5gHYL',
  configUrl: 'https://api.ethfinex.com/trustless/v1/r/get/conf',
  exchangeAddress: '', // fetched from the API
  tokenRegistry: {}, // fetched from the API
}

module.exports = async () => {
  const efxConfig = await post(config.configUrl, {json: {}})

  return {
    ...config,
    ...efxConfig['0x'],
  }
}
