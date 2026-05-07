import { createClient } from "@supabase/supabase-js";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function getRelevantScriptures(query: string, limit = 5): Promise<string> {
  try {
    // Generate embedding for the user's question
    const response = await bedrock.send(new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({ inputText: query, dimensions: 1024 })
    }));
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const queryEmbedding = responseBody.embedding;

    // Search pgvector in Supabase
    const { data, error } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.65, // Adjust this threshold if needed
      match_count: limit
    });

    if (error) {
      console.error("[RAG] Vector search error:", error);
      return "";
    }

    if (!data || data.length === 0) {
      return "";
    }

    // Format the retrieved chunks
    let referenceText = "\n═══════════════════════════════════════════════════════════════\n";
    referenceText += "AUTHORITATIVE SCRIPTURAL REFERENCES (BPHS, Jaimini, etc.)\n";
    referenceText += "═══════════════════════════════════════════════════════════════\n";
    
    data.forEach((doc: any, index: number) => {
      const source = doc.metadata?.source || "Ancient Text";
      referenceText += `\n[Reference ${index + 1} - Source: ${source}]\n${doc.content}\n`;
    });

    return referenceText;
  } catch (err) {
    console.error("[RAG] Failed to get scriptures:", err);
    return "";
  }
}
