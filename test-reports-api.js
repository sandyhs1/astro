require('dotenv').config({path: '.env.local'});
const AstrologyApiClient = require('astrologyapi');
const astro = new AstrologyApiClient({
    userId: process.env.ASTROLOGY_API_USER_ID,
    apiKey: process.env.ASTROLOGY_API_KEY
});

const payload = {
    day: 1, month: 1, year: 2000, hour: 12, min: 0, lat: 28.61, lon: 77.2, tzone: 5.5
};
astro.customRequest({ method: 'POST', endpoint: 'jaimini_details', params: payload })
    .then(res => {
        console.log("Jaimini keys:", Object.keys(res));
        console.log("Has jaimini_karaka?", "jaimini_karaka" in res);
    })
    .catch(e => console.log(e.message));

astro.customRequest({ method: 'POST', endpoint: 'varshaphal_month_chart', params: { ...payload, varshaphal_year: 2024 } })
    .then(res => console.log("Varshaphal months length:", res.length))
    .catch(e => console.log(e.message));

