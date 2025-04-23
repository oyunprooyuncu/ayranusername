const axios = require('axios');
require('dotenv').config();

const USERNAME = "ayran"; // change to target
const CHECK_INTERVAL = 60 * 1000; // every 60 seconds
const WEBHOOK_URL = process.env.WEBHOOK;

async function checkUsername() {
  try {
    const res = await axios.get(`https://www.instagram.com/${USERNAME}/?__a=1`, {
      validateStatus: () => true // prevent throw on 404
    });

    if (res.status === 404) {
      console.log(`[+] Username ${USERNAME} is available!`);
      await axios.post(WEBHOOK_URL, {
        content: `**Username @${USERNAME} is available! Go claim it!**`
      });
    } else {
      console.log(`[-] Username @${USERNAME} is still taken.`);
    }
  } catch (err) {
    console.error("Error checking username:", err.message);
  }
}

setInterval(checkUsername, CHECK_INTERVAL);
checkUsername();