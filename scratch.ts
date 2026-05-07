import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
  const { data, error } = await supabase.rpc('execute_sql', { query: "ALTER TABLE astrologer_clients ADD COLUMN consultation_fee numeric DEFAULT 0;" });
  
  if (error && error.code === 'PGRST202') {
     console.log("No rpc execute_sql found, we will just use postgres directly via psql if needed. Let's see.");
  }
  console.log("Error:", error);
}

addColumn();
