import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const embeddingModel = "text-embedding-3-small";
const indexName = process.env.PINECONE_INDEX_NAME || "ica-conf-papers";

let openaiClient;
let pineconeClient;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openaiClient;
}

function getPinecone() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not configured.");
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }

  return pineconeClient;
}

function normalize(values) {
  const norm = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!norm) return values;
  return values.map((value) => value / norm);
}

export async function getQueryEmbedding(query) {
  const response = await getOpenAI().embeddings.create({
    model: embeddingModel,
    input: query,
  });

  return normalize(response.data[0].embedding);
}

export async function semanticPaperSearch(query, topK = 10) {
  const embedding = await getQueryEmbedding(query);
  const index = getPinecone().index(indexName);
  const response = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
    includeValues: false,
  });

  return (response.matches || []).map((match) => ({
    id: String(match.id),
    score: match.score,
    title: match.metadata?.title || "",
    abstract: match.metadata?.abstract || "",
  }));
}
