const apiKey = process.env.RAGIE_API_KEY;

const url = new URL("https://api.ragie.ai/documents");
url.searchParams.set("filter", JSON.stringify({ scope: "tutorial" }));

const response = await fetch(url, {
  headers: { authorization: `Bearer ${apiKey}` },
});

if (!response.ok) {
  throw new Error(
    "Failed to retrieve data from Ragie API: " + response.statusText
  );
}
const data = await response.json();

console.log(data);
