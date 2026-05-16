require('dotenv').config({path: '.env.local'});
const api = require('astrologyapi');

const astroPdf = new api({
  userId: process.env.ASTROLOGY_API_USER_ID,
  apiKey: process.env.ASTROLOGY_API_KEY,
  apiType: 'pdf'
});

const payload = {
  day: 1, month: 1, year: 2000, hour: 12, min: 0, lat: 28.61, lon: 77.2, tzone: 5.5,
  name: "Test User", gender: "male", place: "New Delhi, India"
};

astroPdf.customRequest({ method: 'POST', endpoint: 'basic_horoscope_pdf', params: payload })
  .then(r => console.log('PDF SDK:', JSON.stringify(r)))
  .catch(e => console.log('PDF SDK ERR:', e.message));
