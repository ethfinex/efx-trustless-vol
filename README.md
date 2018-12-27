<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# EFX Trustless Daily Volume

  - calculates ethfinex trading volume
  - publishes last daily volume to [yesterday.json](https://stats-sheet.herokuapp.com/api/v1/yesterday.json)
  - you can also query by date, i.e. [2018-12-22](https://stats-sheet.herokuapp.com/api/v1/date/2018/12/22)
  - you can only query for days after 13th of September 2018
  - you can only query for days that are already completed (yesterday and before)

TODO:

  - allow other queries on mongodb
    * ATH for total volume
    * ATH for symbol volume
    * Ask for full date-range ?

  - keep track of all time high volume

## Developing

1. run `mongod` locally on port `27017`

2. `npm run develop`

## Trustless Volume Spread Sheet

We have a simple spreadsheet displaying basic historical information
[available here](https://docs.google.com/spreadsheets/d/1gLhHj6tYN2VV6YB7cJEQoyOgKLQJW-zlfUqIeMjuLdE/edit#gid=0)

### You can also deploy your own version to heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

