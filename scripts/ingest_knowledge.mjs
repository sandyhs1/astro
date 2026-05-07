import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFParser from 'pdf2json';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { createClient } from '@supabase/supabase-js';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

import WebSocket from 'ws';
globalThis.WebSocket = WebSocket;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const turndownService = new TurndownService();

const KNOWLEDGE_DIR = path.join(__dirname, '../knowledge_base/files');
const WEBLINKS_FILE = path.join(__dirname, '../knowledge_base/weblinks.txt');

// Helper to chunk text
function chunkText(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

// Helper to generate embedding
async function getEmbedding(text) {
  try {
    const response = await bedrock.send(new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({ inputText: text, dimensions: 1024 })
    }));
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding;
  } catch (error) {
    console.error("Embedding error:", error);
    return null;
  }
}

// Process a single text chunk
async function processChunk(chunk, metadata) {
  const embedding = await getEmbedding(chunk);
  if (!embedding) return;

  const { error } = await supabase.from('astrological_knowledge_base').insert({
    content: chunk,
    metadata,
    embedding
  });

  if (error) {
    console.error('Error inserting to Supabase:', error.message);
  }
}

// Process PDF
async function processPDF(filePath, fileName) {
  console.log(`Processing PDF: ${fileName}`);
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", async () => {
      const rawText = pdfParser.getRawTextContent();
      const cleanText = rawText.replace(/\n\s*\n/g, '\n\n').trim();
      const chunks = chunkText(cleanText);
      
      for (let i = 0; i < chunks.length; i++) {
        await processChunk(chunks[i], { source: fileName, type: 'pdf', chunk: i });
      }
      console.log(`Finished PDF: ${fileName} (${chunks.length} chunks)`);
      resolve();
    });
    
    pdfParser.loadPDF(filePath);
  });
}

// Process Markdown
async function processMD(filePath, fileName) {
  console.log(`Processing MD: ${fileName}`);
  const text = fs.readFileSync(filePath, 'utf-8');
  const chunks = chunkText(text);
  
  for (let i = 0; i < chunks.length; i++) {
    await processChunk(chunks[i], { source: fileName, type: 'md', chunk: i });
  }
  console.log(`Finished MD: ${fileName} (${chunks.length} chunks)`);
}

// Process Weblink
async function processWeblink(url) {
  console.log(`Processing URL: ${url}`);
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, nav, footer, header').remove();
    
    // Convert html to markdown (preserves tables well)
    const markdown = turndownService.turndown($('body').html() || '');
    
    const chunks = chunkText(markdown);
    for (let i = 0; i < chunks.length; i++) {
      await processChunk(chunks[i], { source: url, type: 'url', chunk: i });
    }
    console.log(`Finished URL: ${url} (${chunks.length} chunks)`);
  } catch (error) {
    console.error(`Error processing URL ${url}:`, error.message);
  }
}

// Main function
async function ingestAll() {
  console.log('Starting ingestion process...');
  
  // 1. Process files in directory
  if (fs.existsSync(KNOWLEDGE_DIR)) {
    const files = fs.readdirSync(KNOWLEDGE_DIR);
    for (const file of files) {
      if (file.startsWith('.')) continue; // skip hidden files
      
      const filePath = path.join(KNOWLEDGE_DIR, file);
      if (file.toLowerCase().endsWith('.pdf')) {
        await processPDF(filePath, file);
      } else if (file.toLowerCase().endsWith('.md')) {
        await processMD(filePath, file);
      }
    }
  }

  // 2. Process Weblinks
  if (fs.existsSync(WEBLINKS_FILE)) {
    const linksText = fs.readFileSync(WEBLINKS_FILE, 'utf-8');
    const urls = linksText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    for (const url of urls) {
      await processWeblink(url);
    }
  }

  console.log('Ingestion completely finished!');
}

ingestAll().catch(console.error);
