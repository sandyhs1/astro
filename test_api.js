const VEDASTRO_BASE = "https://api.vedastro.org/api";
async function test() {
  const req = await fetch(`${VEDASTRO_BASE}/Calculate/GeneralAstroData`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Time: {
        StdTime: "14:30 25/10/1992 +05:30",
        Location: { Name: "Mumbai", Longitude: 72.8777, Latitude: 19.0760 }
      },
      Ayanamsa: "RAMAN"
    })
  });
  const data = await req.text();
  console.log("GeneralAstroData:", data.substring(0, 500));
}
test();
