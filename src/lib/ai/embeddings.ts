/**
 * Semantic & Lexical Similarity Layer for Bhopal Civic Memory.
 * 
 * Provides:
 * 1. Interface for dense vector embeddings (e.g. OpenAI / Anthropic / Voyage / Supabase pgvector).
 * 2. Lightweight, zero-dependency token & TF-IDF weighted semantic scoring for candidate retrieval.
 */

export interface EmbeddingProvider {
  embedQuery(text: string): Promise<number[]>;
  embedDocuments(texts: string[]): Promise<number[][]>;
}

/**
 * Cosine similarity between two dense numerical vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Domain-specific keyword tokens with enhanced weights for Bhopal municipal issues.
 */
const CIVIC_DOMAIN_WEIGHTS: Record<string, number> = {
  bhojtal: 2.5,
  wetland: 2.5,
  hyacinth: 2.5,
  lake: 2.0,
  culvert: 2.0,
  inlet: 2.0,
  overflow: 1.8,
  waterlogging: 2.2,
  sump: 2.0,
  drainage: 2.0,
  pothole: 2.2,
  rebar: 2.2,
  subsidence: 2.2,
  bridge: 1.8,
  sandstone: 2.0,
  cornice: 2.0,
  arcade: 2.0,
  masonry: 2.0,
  outage: 1.8,
  luminaire: 2.0,
  pipeline: 2.0,
  rupture: 2.2
};

/**
 * Tokenizes text into normalized n-grams and tokens, removing common stop words.
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'at', 'which', 'on', 'in', 'and', 'or', 'for', 'to', 'with', 'from', 'by', 'near', 'nearby', 'of', 'this', 'that', 'there', 'area', 'road', 'street'
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

/**
 * Computes a weighted lexical-semantic similarity score (0.0 to 1.0)
 * between a new report and an existing candidate incident.
 */
export function computeSemanticSimilarity(
  textA: string,
  textB: string,
  landmarkA?: string,
  landmarkB?: string
): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const setB = new Set(tokensB);
  let weightedMatches = 0;
  let totalWeightA = 0;

  for (const token of tokensA) {
    const weight = CIVIC_DOMAIN_WEIGHTS[token] || 1.0;
    totalWeightA += weight;
    if (setB.has(token)) {
      weightedMatches += weight;
    }
  }

  let baseScore = totalWeightA > 0 ? weightedMatches / totalWeightA : 0;

  // Bonus for matching landmarks if provided
  if (landmarkA && landmarkB) {
    const lTokensA = tokenize(landmarkA);
    const lTokensB = new Set(tokenize(landmarkB));
    const landmarkMatch = lTokensA.some((t) => lTokensB.has(t));
    if (landmarkMatch) {
      baseScore = Math.min(1.0, baseScore + 0.25);
    }
  }

  return Math.min(1.0, Math.max(0.0, baseScore));
}
