async function test() {
  const req = await fetch("https://api.vedastro.org/api/Calculate/ListAllCalls");
  const data = await req.json();
  if (Array.isArray(data.Payload)) {
     console.log(data.Payload[0]);
     const methods = data.Payload.map(c => c.Name || c.MethodName || Object.values(c)[0]);
     console.log("Matching General:", methods.filter(m => m && typeof m === 'string' && m.toLowerCase().includes("general")));
     console.log("Matching Dasa:", methods.filter(m => m && typeof m === 'string' && m.toLowerCase().includes("dasa")));
     console.log("Matching Ashtak:", methods.filter(m => m && typeof m === 'string' && m.toLowerCase().includes("ashtak")));
  } else {
     console.log(typeof data.Payload, data.Payload);
  }
}
test();
