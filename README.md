<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# EFX Trustless Daily Volume

  - calculates ethfinex trading volume
  - publishes last daily volume to [yesterday.json](https://stats-sheet.herokuapp.com/api/v1/yesterday.json)
  - you can also query by data, i.e. [2018-12-22](https://stats-sheet.herokuapp.com/api/v1/date/2018/12/22)

TODO:

  - stores on a mongodb database and allow better queries
  - save volume on a per token basis

## Simple Usage

```
const getVolume = require('./src/index');
(async function() {
  console.log("24h volume: " + await getVolume());
})();
```

## Trustless Volume Sheet usage

Run `npm install` or `yarn`.

Generate the `credentials.json` file through this url by clicking the `ENABLE THE GOOGLE SHEETS API` button.
https://developers.google.com/sheets/api/quickstart/nodejs and put it in the root of the project.

Populate the `sheetConfig.json` file with your sheetId and sheet name.

Run `node src/cronJob.js`

### You can also deploy your own version to heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

