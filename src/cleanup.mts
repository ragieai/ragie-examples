const apiKey = process.env.RAGIE_API_KEY;

while (true) {
  const response = await fetch("https://api.ragie.ai/documents", {
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve data from Ragie API: ${response.status} ${response.statusText}`
    );
  }
  const payload = await response.json();

  for (const document of payload.documents) {
    if (document.metadata.environment !== "tutorial") {
      continue;
    }

    const response = await fetch(
      `https://api.ragie.ai/documents/${document.id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to delete document ${document.id}: ${response.status} ${response.statusText}`
      );
    }
    console.log(`Deleted document ${document.id}`);
  }

  if (!payload.pagination.next_cursor) {
    console.warn("No more documents\n");
    break;
  }
}
