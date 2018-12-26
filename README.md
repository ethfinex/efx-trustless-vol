<img src="https://avatars3.githubusercontent.com/u/33315316?s=200&v=4" align="right" />

# EFX Trustless Daily Volume

  - calculates ethfinex trading volume
  - publishes last daily volume to [yesterday.json](https://stats-sheet.herokuapp.com/api/v1/yesterday.json)
  - you can also query by data, i.e. [2018-12-22](https://stats-sheet.herokuapp.com/api/v1/date/2018/12/22)

TODO:

  - store results in mongodb in order to don't lose on every boot

  - automatically fetch volume for the last X days if not yet on the database?

  - allow detailed queries on mongodb

  - keep track of all time high volume

## Developing

1. run mongodb locally

2. `npm run develop`

## Trustless Volume Spread Sheet

We have a simple spreadsheet displaying basic historical information
[available here](https://docs.google.com/spreadsheets/d/1gLhHj6tYN2VV6YB7cJEQoyOgKLQJW-zlfUqIeMjuLdE/edit#gid=0)

### You can also deploy your own version to heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

