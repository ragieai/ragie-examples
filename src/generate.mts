import OpenAI from "openai";

const ragieApiKey = process.env.RAGIE_API_KEY;
const openAiApiKey = process.env.OPENAI_API_KEY;

const query = "What does Chamath think about Davos?";

const response = await fetch("https://api.ragie.ai/retrievals", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + ragieApiKey,
  },
  body: JSON.stringify({ query }),
});

if (!response.ok) {
  console.error(
    `Failed to retrieve data from Ragie API: ${response.status} ${response.statusText}`
  );
  process.exit(1);
}

const data = await response.json();
const chunkText = data.scored_chunks.map((chunk) => chunk.text);
const systemPrompt = `These are very important to follow:

You are "Ragie AI", a professional but friendly AI chatbot working as an assitant to the user.

Your current task is to help the user based on all of the information available to you shown below.
Answer informally, directly, and concisely without a heading or greeting but include everything relevant.
Use richtext Markdown when appropriate including bold, italic, paragraphs, and lists when helpful.
If using LaTeX, use double $$ as delimiter instead of single $. Use $$...$$ instead of parentheses.
Organize information into multiple sections or points when appropriate.
Don't include raw item IDs or other raw fields from the source.
Don't use XML or other markup unless requested by the user.

Here is all of the information available to answer the user:
===
${chunkText}
===

If the user asked for a search and there are no results, make sure to let the user know that you couldn't find anything,
and what they might be able to do to find the information they need.

END SYSTEM INSTRUCTIONS`;

const openai = new OpenAI({ apiKey: openAiApiKey });
const chatCompletion = await openai.chat.completions.create({
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ],
  model: "gpt-4o",
});

console.log(chatCompletion.choices[0].message.content);
