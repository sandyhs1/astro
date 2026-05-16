require('dotenv').config({path: '.env.local'});
const api = require('astrologyapi');

const astro = new api({
  userId: process.env.ASTROLOGY_API_USER_ID,
  apiKey: process.env.ASTROLOGY_API_KEY
});

const payload = {
  day: 1, month: 1, year: 2000, hour: 12, min: 0, lat: 28.61, lon: 77.2, tzone: 5.5,
  name: "Test User", gender: "male", place: "New Delhi, India"
};

// Check standard JSON endpoint
astro.customRequest({ method: 'POST', endpoint: 'jaimini_details', params: payload })
  .then(r => console.log('JAIMINI JSON:', r ? "SUCCESS" : "FAIL"))
  .catch(e => console.log('JAIMINI ERR:', e.message));

// Check PDF endpoint directly using standard fetch
const auth = Buffer.from(`${process.env.ASTROLOGY_API_USER_ID}:${process.env.ASTROLOGY_API_KEY}`).toString("base64");
fetch("https://pdf.astrologyapi.com/v1/basic_horoscope_pdf", {
  method: "POST",
  headers: {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(r => console.log("PDF RAW FETCH:", JSON.stringify(r)))
.catch(e => console.log("PDF RAW FETCH ERR:", e));
