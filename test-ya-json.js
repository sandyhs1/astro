require('dotenv').config({path: '.env.local'});
const { GoogleGenerativeAI } = require('@google/generative-ai');
const api = require('astrologyapi');



const YEAR_AHEAD_PROMPT = (pName, year, yogasJson, monthJson) => `You are KARMA — the Grand Master Jyotishi of Quantum Karma.
You are generating a deeply personal, brutal, savage, legit, and accurate YEAR AHEAD ${year} REPORT for ${pName}.

Our audience is GenZ, Gen Alpha, and Millennials. No sugarcoating. No fluff. Give subtle nuances.
Do not use these BANNED words: COSMOS, COSMIC, DANCE, TAPESTRY, ILLUMINATE, POETIC, AMULET, SHIMMERING.
NO GEMSTONE RECOMMENDATIONS EVER.

Here is the precise Varshaphal (Solar Return) data from the planetary engine:
Active Yogas for the Year:
${yogasJson}

Monthly Chart (Month 1 is the month of their birthday this year):
${monthJson}

TASK:
Return a pure JSON object (NO markdown code blocks, NO text outside JSON) with this exact schema:
{
  "intro": "Brutal, honest, yet encouraging assessment of what this year means for them based on the Varshaphal. 3-4 sentences.",
  "activeYogas": [
    {
      "name": "Name of the Yoga",
      "meaning": "Explain EXACTLY what this yoga means, its impact, and how it is formed based on the data."
    }
  ],
  "months": [
    {
      "monthNumber": 1,
      "theme": "A powerful 4-5 word theme for the month based on the Muntha or key planets.",
      "keywords": ["Keyword1", "Keyword2", "Keyword3"],
      "nuances": "Deep, subtle details and nuances about what will happen this month. Legit and accurate.",
      "actionPlan": "What they MUST do this month.",
      "advice": "Honest advice and encouragement for this specific month."
    }
  ] // Generate all 12 months exactly as passed in the data
}`;

async function run() {
  const astroClient = new api({ userId: process.env.ASTROLOGY_API_USER_ID, apiKey: process.env.ASTROLOGY_API_KEY });
  const payload = { day: 1, month: 1, year: 2000, hour: 12, min: 0, lat: 28.61, lon: 77.2, tzone: 5.5, varshaphal_year: 2026 };
  
  console.log("Fetching API data...");
  const mcRes = await astroClient.customRequest({ method: 'POST', endpoint: 'varshaphal_month_chart', params: payload });
  const vyRes = await astroClient.customRequest({ method: 'POST', endpoint: 'varshaphal_yoga', params: payload });

  const yogasJson = JSON.stringify(vyRes.filter(y => y.is_yog_happening).map(y => ({ name: y.name, description: y.description })));
  const monthJson = JSON.stringify(mcRes.slice(0, 12).map((m, i) => ({ month: i+1, ascendant: m.ascendant, muntha_house: m.muntha_house })));

  const prompt = YEAR_AHEAD_PROMPT("Seeker", 2026, yogasJson, monthJson);
  
  console.log("Calling LLM...");
  try {
      const gemini = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log("LLM Response Length:", text.length);
      console.log("Last 200 chars:", text.slice(-200));
      let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.substring(firstBrace, lastBrace + 1);
      }
      JSON.parse(clean);
      console.log("JSON Parsed Successfully.");
  } catch (e) {
      console.log("Error Parsing JSON:", e.message);
  }
}
run();
