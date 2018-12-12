const fs = require('fs');
const cron = require('node-cron');
const getDailyVolume = require('./index');
const sheetService = require('./sheetService');

schedule = () => {
  getAuth( (err, content) => {

    if (err) {
      console.log('Error loading client secret file:', err);
      return console.log('Please refer to the README.md for instructions on generating the credentials.json file.');
    }

    // Authorize a client with credentials, then call the Google Sheets API.
    sheetService.authorize(JSON.parse(content), (auth) => {
      console.log('CRON job is running...');
      cron.schedule('1 0 * * *', async () => {

        console.log('Scheduled CRON job is being run.');
        const volume = await getDailyVolume();
        const date = new Date();
        date.setDate(date.getDate());
        const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        sheetService.writeToSheet(auth, [[formattedDate, volume]]);
        console.log(`CRON job finished, current volume is ${volume}, date ${formattedDate}`);

        // writes last cron result to public/last.json file
        entry =  {
          date: formattedDate,
          volume: volume
        }

        json = JSON.stringify(entry, null, 2)

        path = __dirname + '/public/last.json'

        fs.writeFileSync(path, json, 'utf-8')

      });
    });
  });
}

getAuth = (done) => {
  let auth

  if(process.env.CREDENTIALS) {
    return done(null, process.env.CREDENTIALS)
  }

  fs.readFile('credentials.json', done)
}

schedule()
