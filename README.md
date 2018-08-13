# EFX Trustless Daily Volume

Returns trading volume for past 24h

## Usage

```
const getVolume = require('./index');
(async function() { 
  console.log("24h volume: " + await getVolume()); 
})();
```