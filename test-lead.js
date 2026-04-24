const fetch = require('node-fetch');

async function testLead() {
    console.log("🚀 Testing /api/save-lead endpoint...");
    
    // Fallback to local server that is currently running
    const url = 'http://localhost:3000/api/save-lead';
    
    const testData = {
        fullName: "API Tester",
        email: "test.api.error@example.com",
        dob: "1990-01-01",
        tob: "12:00 PM",
        pob: "Test City",
        questions: "Why is the data not saving in Supabase?",
        paymentStatus: "pending",
        transactionId: "TEST_123"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const data = await response.json();
        
        console.log(`HTTP Status: ${response.status}`);
        console.log("Response Body:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("❌ Test failed:", err);
    }
}

testLead();
