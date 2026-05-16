require('dotenv').config({path: '.env.local'});
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const fpsRes = await fetch(`${url}/rest/v1/family_profiles?limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  console.log("Family Profiles keys:", Object.keys((await fpsRes.json())[0] || {}));

  const leadsRes = await fetch(`${url}/rest/v1/onboarding_leads?limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  console.log("Onboarding Leads keys:", Object.keys((await leadsRes.json())[0] || {}));
}
run();
