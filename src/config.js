const Web3 = require('web3')
const { ExchangeWrapper } = require('@0x/contract-wrappers')
const { Web3Wrapper } = require('@0x/web3-wrapper')
const {post} = require('request-promise')
const wrapperToToken = require('./lib/wrapperToToken')
const moment = require('moment')

let config = {
  networkId: 1,
  web3ProviderUrl: process.env.WEB3_PROVIDER,
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

  config.previousTokenMap = {
    '0xaa7427d8f17d87a28f5e1ba3adbb270badbe1011' : 'ETH',
    '0xc94ec1f80c4423ae0cecb4296b5de530219f0f9d' : 'NEC',
    '0xcf67d7a481ceeca0a77f658991a00366fed558f7' : 'ZRX',
    '0x60f8526f09caaf0008187945ccd88bc43790042c' : 'OMG',
    '0x1488f99d305990694e19b3e72f6f0307cfa1df4e' : 'REP',
    '0xb0abd4cc5195560209492b6854c666d7cff8c03c' : 'SAN',
    '0x8aa72dd6045505836f643b39b82e70fd705f9686' : 'SNT',
    '0x5d173723236e6f844eed04f4fba72db5e32adb7c' : 'GNT',
    '0xab056a8119bb91ca50631bd319ee3df654bebfa2' : 'EDO',
    '0xb33ce6b1e48f450b4c6d4c0a3f281237eeea2dec' : 'FUN',
    '0xd9ebebfdab08c643c5f2837632de920c70a56247' : 'DAI',
    '0x70b04d0684ea9dc0c8e244e0a1453744350f3864' : 'SPK',
    '0x680bf2eebf0ad9b183ac2ff88d16f5a4e41480e9' : 'NIO',
    '0x8747265bf3cd756a08a3dd2e61eb933d5167982f' : 'DGX',
    '0x38ae374ecf4db50b0ff37125b591a04997106a32' : 'MKR',
    '0xe82cfc4713598dc7244368cf5aca1b102a04ce33' : 'BAT',
    '0x69391cca2e38b845720c7deb694ec837877a8e53' : 'USC',
    '0x3b4d5a7dd02dc866dd60aeb872dfbfe37564c684' : 'TKN',
    '0xaaaf91d9b90df800df4f55c205fd6989c977e73a' : 'TKN',
    '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2' : 'MKR',
    '0x7d5a230dd6b5cd24308566e8e4074c1d615862b3' : 'ENJ',
    '0xdac17f958d2ee523a2206206994597c13d831ec7' : 'USD',
    '0x1a9b2d827f26b7d7c18fec4c1b27c1e8deeba26e' : 'USD',
    '0xeb52a95695ffa4cf411b804455287f0717884899' : 'USD',
  }

  const web3Provider = new Web3.providers.HttpProvider(config.web3ProviderUrl)

  config.exchangeWrapper = new ExchangeWrapper(
    new Web3Wrapper(web3Provider),
    config.networkId,
    null,
    null,
    config.exchangeAddress,
  )

  config.previousExchangeWrapper = new ExchangeWrapper(
    new Web3Wrapper(web3Provider),
    config.networkId,
    null,
    null,
    '0x4f833a24e1f95d70f028921e27040ca56e09ab0b'
  )

  // previous 2.0 version was being used until 14/07/2019
  config.previousVersionDate = moment.utc().year(2019).month(6).date(14)

  return config
}
