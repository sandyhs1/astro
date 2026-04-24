const req = await fetch("http://localhost:3000/api/astrology/dasa", {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({
    dob: "1992-10-25",
    tob: "14:30",
    pob: "Mumbai",
    timezone: "+05:30",
    startDate: "2020-01-01",
    endDate: "2022-01-01"
  })
});
const d = await req.json();
console.log(JSON.stringify(d, null, 2));
