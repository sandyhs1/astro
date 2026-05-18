const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  // Test inserting "self"
  const { data, error } = await supabaseAdmin.from('saved_reports').insert({
    user_id: "00000000-0000-0000-0000-000000000000",
    profile_id: "self",
    report_type: "test",
    content: {}
  });
  console.log("Insert 'self' error:", error?.message || "Success");
  
  // Test inserting null
  const { data: d2, error: e2 } = await supabaseAdmin.from('saved_reports').insert({
    user_id: "00000000-0000-0000-0000-000000000000",
    profile_id: null,
    report_type: "test",
    content: {}
  });
  console.log("Insert null error:", e2?.message || "Success");
}
checkSchema();
