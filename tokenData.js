module.exports.wrapperToToken = (tokenInfo) =>
  Object.keys(tokenInfo)
    .reduce((accumulator, token) => {
      console.log(token)
      accumulator[tokenInfo[token].wrapperAddress] = token;
      return accumulator
    }, {})
