let cache = {}

module.exports = async (key, value) => {
  if(cache[key]) return cache[key]

  // if value isnt cached, ask for promise and cache it
  return cache[key] = await value()
}
