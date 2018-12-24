module.exports = (tokenInfo) =>
  Object.keys(tokenInfo)
    .reduce((accumulator, token) => {
      accumulator[tokenInfo[token].wrapperAddress] = token
      return accumulator
    }, {})
