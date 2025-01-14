import { writeFileSync } from "fs";

const DOWNLOAD_FOLDER = "data/downloads";
const apiKey = process.env.RAGIE_API_KEY;
const url = new URL("https://api.ragie.ai/documents");
url.searchParams.set("filter", JSON.stringify({ scope: "tutorial" }));

const documentListResponse = await fetch(url, {
  headers: { authorization: `Bearer ${apiKey}` },
});

if (!documentListResponse.ok) {
  throw new Error(
    "Failed to retrieve data from Ragie API: " +
      documentListResponse.statusText,
  );
}
const documentListData = await documentListResponse.json();

console.log(documentListData);

const id = documentListData.documents[0].id;

const documentDetailsResponse = await fetch(
  `https://api.ragie.ai/documents/${id}`,
  {
    headers: { authorization: `Bearer ${apiKey}` },
  },
);

const documentDetailsData = await documentDetailsResponse.json();

const documentSourceResponse = await fetch(
  `https://api.ragie.ai/documents/${id}/source`,
  {
    headers: { authorization: `Bearer ${apiKey}` },
  },
);
const arrayBuffer = await documentSourceResponse.arrayBuffer();
const downloadPath = `${DOWNLOAD_FOLDER}/${documentDetailsData.name}`;
writeFileSync(downloadPath, Buffer.from(arrayBuffer));
console.log(`Wrote file to ${downloadPath}`);
