const ragieApiKey = process.env.RAGIE_API_KEY;
const ragieApiUrl = process.env.RAGIE_API_URL || "https://api.ragie.ai";

type DocumentIndexResponse = {
  pagination: {
    next_cursor: string;
  };
  documents: {
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    name: string;
    chunk_count: number;
    metadata: unknown;
  }[];
};

if (!ragieApiKey) {
  throw new Error("RAGIE_API_KEY is required");
}

(async () => {
  while (true) {
    const response = await fetch(ragieApiUrl + "/documents", {
      headers: {
        authorization: `Bearer ${ragieApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve data from Ragie API: ${response.status} ${response.statusText}`
      );
    }
    const payload = (await response.json()) as DocumentIndexResponse;

    for (const document of payload.documents) {
      const response = await fetch(ragieApiUrl + "/documents/" + document.id, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${ragieApiKey}`,
        },
      });

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
})();
