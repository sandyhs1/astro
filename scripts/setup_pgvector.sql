-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

drop function if exists match_documents;
drop table if exists astrological_knowledge_base;

-- Create a table to store your massive documents
create table if not exists astrological_knowledge_base (
  id bigserial primary key,
  content text not null, -- The actual text chunk
  metadata jsonb,        -- To store source file name, URL, or topic
  embedding vector(1024)  -- 1024 dimensions for Amazon Titan Embeddings
);

-- Create a function to search for documents
-- This uses cosine distance (<=>) which is standard for embeddings
create or replace function match_documents (
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    astrological_knowledge_base.id,
    astrological_knowledge_base.content,
    astrological_knowledge_base.metadata,
    1 - (astrological_knowledge_base.embedding <=> query_embedding) as similarity
  from astrological_knowledge_base
  where 1 - (astrological_knowledge_base.embedding <=> query_embedding) > match_threshold
  order by astrological_knowledge_base.embedding <=> query_embedding
  limit match_count;
$$;

-- Create an index to speed up vector searches
create index if not exists astrological_knowledge_base_embedding_idx 
on astrological_knowledge_base 
using ivfflat (embedding vector_cosine_ops) 
with (lists = 100);
