# EFX Trustless Daily Volume

Returns trading volume for past 24h

## Usage

```
const getVolume = require('./index');
(async function() { 
  console.log("24h volume: " + await getVolume()); 
})();
```

## Trustless Volume Sheet usage

Run `npm install` or `yarn`.

Generate the `credentials.json` file through this url by clicking the `ENABLE THE GOOGLE SHEETS API` button.
https://developers.google.com/sheets/api/quickstart/nodejs and put it in the root of the project.

Populate the `sheetConfig.json` file with your sheetId and sheet name.

Run `node cronJob.js`