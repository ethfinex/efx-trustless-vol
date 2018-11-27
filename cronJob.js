const fs = require('fs');
const cron = require('node-cron');
const getDailyVolume = require('./index');
const sheetService = require('./sheetService');

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
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
      date.setDate(date.getDate() - 1);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      sheetService.writeToSheet(auth, [[formattedDate, volume]]);
      console.log(`CRON job finished, current volume is ${volume}, date ${formattedDate}`);
    });
  });
});