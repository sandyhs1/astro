const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

async function testPortals() {
    const supabaseUrl = 'https://yrgkctlkhhehkchtxedz.supabase.co';
    const supabaseKey = 'sb_secret_havrE2CoDfhYeieKPY5cTw_TU-opXjg'; // From env.local

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Simulating lead capture...");
    // 1. Insert lead
    const { data: leadData, error: leadErr } = await supabase
        .from('onboarding_leads')
        .insert([{
            full_name: "Trigger Tester",
            email: "trigger@test.com",
            dob: "1990-01-01",
            tob: "12:00 PM",
            pob: "Test City",
            questions: "Testing triggers",
            payment_status: "pending"
        }])
        .select()
        .single();
    
    if (leadErr) {
        console.error("Lead error:", leadErr);
        return;
    }

    console.log("Lead inserted. ID:", leadData.id);

    // 2. Insert portal
    const accessToken = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    const accessPin = "123456";

    console.log("Attempting to insert client_portal...");
    const { data: portalData, error: portalError } = await supabase
        .from('client_portals')
        .insert({
            lead_id: leadData.id,
            full_name: "Trigger Tester",
            email: "trigger@test.com",
            access_token: accessToken,
            access_pin: accessPin,
            status: 'pending'
        })
        .select()
        .single();

    if (portalError) {
        console.error("❌ THE PORTAL ERROR IS:");
        console.error(JSON.stringify(portalError, null, 2));
    } else {
        console.log("✅ Portal inserted perfectly:", portalData.id);
    }
}

testPortals();
