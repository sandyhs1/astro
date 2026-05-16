require('dotenv').config({path: '.env.local'});
const api = require('astrologyapi');
const astroClient = new api({ userId: process.env.ASTROLOGY_API_USER_ID, apiKey: process.env.ASTROLOGY_API_KEY });
async function run() {
  const payload = { day: 1, month: 1, year: 2000, hour: 12, min: 0, lat: 28.61, lon: 77.2, tzone: 5.5 };
  const n = await astroClient.customRequest({ method: 'POST', endpoint: 'astro_details', params: payload });
  console.log("ASTRO:", n);
}
run();
