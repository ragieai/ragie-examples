import fs from "fs";
import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";

path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.RAGIE_API_KEY;

if (!apiKey) {
  console.error("RAGIE_API_KEY is required");
  process.exit(1);
}

const relativePath = "../data/podcasts/";
const absolutePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  relativePath
);

const files = fs.readdirSync(absolutePath);

for (const file of files) {
  const filePath = path.join(absolutePath, file);
  const blob = new Blob([await readFile(filePath)]);

  console.log("Uploading: ", filePath);

  const formData = new FormData();
  formData.append("file", blob, file);
  formData.append(
    "metadata",
    JSON.stringify({ title: file, environment: "tutorial" })
  );

  const options = {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      accept: "application/json",
    },
    body: formData,
  };

  const response = await fetch("https://api.ragie.ai/documents", options);

  if (!response.ok) {
    const body = await response.text();
    console.error("Failed to post: " + response.statusText + ": " + body);
    process.exit(1);
  }

  const indexed = await response.json();

  console.log(indexed);
}
