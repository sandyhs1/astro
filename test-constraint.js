const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false }, global: { fetch: fetch } } // use global fetch
  );

  const { data, error } = await supabase.from('saved_reports').insert({
    user_id: "00000000-0000-0000-0000-000000000000",
    report_type: "year_ahead",
    content: {}
  });
  
  console.log("Error details:", error);
}

testInsert();
