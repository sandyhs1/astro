const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from("family_profiles").select("id").limit(1);
  if (error) {
    console.log("Error:", error);
    return;
  }
  
  if (data && data.length > 0) {
    const testId = data[0].id;
    console.log("Updating ID", testId);
    const { error: updateError } = await supabase.from("family_profiles").update({ lat: 10, lng: 20 }).eq("id", testId);
    console.log("Update with lat/lng:", updateError ? updateError.message : "Success");
    
    const { error: updateError2 } = await supabase.from("family_profiles").update({ lat: 10, lon: 20 }).eq("id", testId);
    console.log("Update with lat/lon:", updateError2 ? updateError2.message : "Success");
  }
}
test();
