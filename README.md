<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# EFX Trustless Daily Volume

  - calculates ethfinex trading volume
  - publishes last daily volume to [/api/v1/yesterday](https://stats-sheet.herokuapp.com/api/v1/yesterday)
  - you can also query by date, i.e. [/api/v1/date/2018/12/22](https://stats-sheet.herokuapp.com/api/v1/date/2018/12/22)
    - you can only query for days after 13th of September 2018
    - you can only query for days that are already completed (yesterday and before)
  - publishes ATH [/api/v1/ath](https://stats-sheet.herokuapp.com/api/v1/ath)

TODO:

  - keep track of all time high volume

  - allow other queries on mongodb
    * ATH for symbol volume
    * Ask for full date-range ?

  - refactor src/lib folder

## Developing

1. run `mongod` locally on port `27017`

2. `npm run develop`

## Trustless Volume Spread Sheet

We have a simple spreadsheet displaying basic historical information
[available here](https://docs.google.com/spreadsheets/d/1gLhHj6tYN2VV6YB7cJEQoyOgKLQJW-zlfUqIeMjuLdE/edit#gid=0)

### You can also deploy your own version to heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

