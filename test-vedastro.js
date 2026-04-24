const VEDASTRO_BASE = "https://api.vedastro.org/api";
async function fetchAllPlanetData(hhmm, dd, mm, yyyy, tz, lat, lon) {
    const seg = `Location/${lat},${lon}/Time/${hhmm}/${dd}/${mm}/${yyyy}/${tz.replace("+","%2B")}`;
    const url = `${VEDASTRO_BASE}/Calculate/AllPlanetData/PlanetName/All/${seg}/Ayanamsa/LAHIRI`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data.Payload.AllPlanetData, null, 2));
}
fetchAllPlanetData("14:30", "25", "10", "1992", "+05:30", 19.0760, 72.8777);
