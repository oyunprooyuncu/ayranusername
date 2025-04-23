const axios = require('axios');
const express = require('express');
require('dotenv').config();

const app = express();
const USERNAME = "ayran"; // change to target
const CHECK_INTERVAL = 60 * 1000; // every 60 seconds
const WEBHOOK_URL = process.env.WEBHOOK;
let log = []; // To store logs

async function checkUsername() {
  try {
    const res = await axios.get(`https://www.instagram.com/${USERNAME}/?__a=1`, {
      validateStatus: () => true // prevent throw on 404
    });

    if (res.status === 404) {
      const message = `[+] Username ${USERNAME} is available!`;
      console.log(message);
      log.push(message); // Add log
      await axios.post(WEBHOOK_URL, {
        content: `**Username @${USERNAME} is available! Go claim it!**`
      });
    } else {
      const message = `[-] Username @${USERNAME} is still taken.`;
      console.log(message);
      log.push(message); // Add log
    }
  } catch (err) {
    const errorMessage = `Error checking username: ${err.message}`;
    console.error(errorMessage);
    log.push(errorMessage); // Add log
  }
}

// Serve a simple status page and logs via Express
app.get('/status', (req, res) => {
  res.send('Username checker is running...');
});

app.get('/logs', (req, res) => {
  res.send(`<pre>${log.join("\n")}</pre>`);
});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Username Sniper App!</h1><p>Status: <a href="/status">Check Status</a><br><a href="/logs">View Logs</a></p>');
});

// Start Express server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port ' + (process.env.PORT || 3000));
});

setInterval(checkUsername, CHECK_INTERVAL);
checkUsername();
