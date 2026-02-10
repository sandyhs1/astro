const emailjs = require('@emailjs/browser');

// EmailJS Credentials
const SERVICE_ID = 'service_kejjsw8';
const TEMPLATE_ID = 'template_qnjfx8b';
const PUBLIC_KEY = 'p0Y1TsA4CgkB89zWO';

// Test data
const testData = {
    fullName: "Test User",
    email: "test@example.com",
    dob: "1990-01-01",
    tob: "12:00",
    pob: "Bangalore, India",
    questions: "This is a test submission to verify EmailJS integration is working correctly.",
    paymentStatus: "Mock Payment Success",
    transactionId: `TXN${Date.now()}`,
    submissionTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
};

console.log("🚀 Sending test email to sandesh@soulsync.tech...");
console.log("Test Data:", testData);

emailjs.send(SERVICE_ID, TEMPLATE_ID, testData, PUBLIC_KEY)
    .then((response) => {
        console.log("✅ SUCCESS! Email sent successfully!");
        console.log("Response Status:", response.status);
        console.log("Response Text:", response.text);
        console.log("\n✅ Check sandesh@soulsync.tech for the test email!");
    })
    .catch((error) => {
        console.error("❌ FAILED! Error sending email:");
        console.error(error);
    });
