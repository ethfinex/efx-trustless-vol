const Web3 = require('web3')
const getConfig = require('../config')
const moment = require('moment')

const toDate = require('./timestampToDate')

/**
 * Find nearest block to given timestamp, expect timestamp in seconds
 */
module.exports = async (targetTimestamp, lowerLimitStamp, higherLimitStamp) => {
  // target timestamp or last midnight
  targetTimestamp = targetTimestamp || moment.utc().startOf('day').unix()

  const config = await getConfig()
  const web3 = new Web3(config.web3ProviderUrl)

  // decreasing average block size will decrease precision and also
  // decrease the amount of requests made in order to find the closest
  // block
  let averageBlockTime = 17

  // get current block number
  let blockNumber = await web3.eth.getBlockNumber() - 1
  let block = await web3.eth.getBlock(blockNumber)

  let requestsMade = 0

  while(block.timestamp > targetTimestamp){

    let decreaseBlocks = (block.timestamp - targetTimestamp) / averageBlockTime
    decreaseBlocks = parseInt(decreaseBlocks)

    if(decreaseBlocks < 1){
      break
    }

    blockNumber -= decreaseBlocks

    block = await web3.eth.getBlock(blockNumber)
    requestsMade += 1
  }


  // if we undershoot the day
  if(lowerLimitStamp && block.timestamp < lowerLimitStamp) {
    while(block.timestamp < lowerLimitStamp){
      blockNumber += 1

      block = await web3.eth.getBlock(blockNumber)
      requestsMade += 1
    }
  }

  // if we overshoot the day
  if(higherLimitStamp && block.timestamp > higherLimitStamp) {
    while(block.timestamp > higherLimitStamp){
      blockNumber -= 1

      block = await web3.eth.getBlock(blockNumber)
      requestsMade += 1
    }
  }

  console.log( "tgt timestamp   ->", targetTimestamp)
  console.log( "tgt date        ->", toDate(targetTimestamp))
  console.log( "" )

  console.log( "block timestamp ->", block.timestamp)
  console.log( "block date      ->", toDate(block.timestamp))
  console.log( "" )

  console.log( "requests made   ->", requestsMade)

  return block
}
