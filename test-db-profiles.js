require('dotenv').config({path: '.env.local'});
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const usersRes = await fetch(`${url}/rest/v1/onboarding_leads?limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const users = await usersRes.json();
  if (!users || users.length === 0) return console.log("No leads found");
  const user = users[0];
  console.log("Lead:", user);

  const fpsRes = await fetch(`${url}/rest/v1/family_profiles?limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  console.log("Family Profiles:", await fpsRes.json());
}
run();
