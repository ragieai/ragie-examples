const apiKey = process.env.RAGIE_API_KEY;

const response = await fetch("https://api.ragie.ai/documents", {
  headers: { authorization: `Bearer ${apiKey}` },
});

if (!response.ok) {
  throw new Error("Failed to retrieve data from Ragie API");
}
const data = await response.json();

console.log(data);
