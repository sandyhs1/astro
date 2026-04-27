/**
 * test-emailjs-intake.mjs
 * Run: node test-emailjs-intake.mjs
 *
 * Sends a test intake email to help@quantumkarma.tech via EmailJS
 * using the email-birth-details credentials.
 */

// EmailJS server-side REST API endpoint
const EMAILJS_REST_URL = "https://api.emailjs.com/api/v1.0/email/send";

const SERVICE_ID  = "service_kejjsw8";
const TEMPLATE_ID = "template_y2oy1ia";
const PUBLIC_KEY  = "p0Y1TsA4CgkB89zWO";
const PRIVATE_KEY = "vbXH1RgTkXshomEmqVSjA";

const testPayload = {
  service_id:  SERVICE_ID,
  template_id: TEMPLATE_ID,
  user_id:     PUBLIC_KEY,
  accessToken: PRIVATE_KEY,
  template_params: {
    to_email:       "help@quantumkarma.tech",
    user_name:      "Rahul Sharma (TEST)",
    user_email:     "rahul.test@example.com",
    date_of_birth:  "15 August 1990",
    time_of_birth:  "07:30",
    place_of_birth: "Mumbai, Maharashtra, India",
    questions:      "This is a TEST submission from the automated test script.\n\n1. Will I get a promotion this year?\n2. What is blocking my financial growth?\n3. When will I find the right partner?",
    submission_time: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "long",
      timeStyle: "short",
    }),
  },
};

console.log("\n🚀 Sending test EmailJS intake email to help@quantumkarma.tech...\n");
console.log("Service ID: ", SERVICE_ID);
console.log("Template ID:", TEMPLATE_ID);
console.log("Payload:", JSON.stringify(testPayload.template_params, null, 2));
console.log("\n---");

const res = await fetch(EMAILJS_REST_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testPayload),
});

const responseText = await res.text();

if (res.ok) {
  console.log("\n✅ SUCCESS! Email sent successfully.");
  console.log("Status:", res.status);
  console.log("Response:", responseText);
  console.log("\n📬 Check help@quantumkarma.tech inbox for the test email.");
} else {
  console.error("\n❌ FAILED. EmailJS returned an error:");
  console.error("Status:", res.status);
  console.error("Response:", responseText);
  console.error("\nCommon causes:");
  console.error("  • Service ID is wrong or service is not connected");
  console.error("  • Template ID is wrong or template uses wrong variable names");
  console.error("  • Public/Private Key mismatch");
  console.error("  • 'To Email' field in template is not set to {{to_email}}");
}
