# Moviora AI

# Moviora AI

Moviora AI is an AI-powered movie intelligence platform that combines movie discovery, review analysis, personalized recommendations, and Retrieval-Augmented Generation (RAG) to deliver contextual movie insights and conversational experiences.

Built with Next.js, FastAPI, PostgreSQL, and modern LLM technologies, the platform demonstrates production-grade AI application architecture, API design, and full-stack development practices.

## Features

- Movie discovery interface with cinematic cards and detail pages
- AI assistant workspace for movie questions and recommendations
- Review sentiment panels and audience insight summaries
- FastAPI backend with typed movie and AI endpoints
- RAG service boundary ready for Chroma, Pinecone, OpenAI, or Gemini
- PostgreSQL-ready architecture with Docker Compose
- GitHub-ready structure for deployment and future CI/CD

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, Pydantic |
| Database | PostgreSQL |
| RAG | Chroma/Pinecone-ready retriever service |
| AI APIs | OpenAI or Gemini-ready configuration |
| Deployment | Vercel, Render/Railway/Fly.io, Docker |

## Architecture

```text
TMDb API / Reviews / Movie Data
        ↓
Cleaning + Chunking
        ↓
Embeddings
        ↓
Vector Database
        ↓
Retriever
        ↓
Top-K Context Chunks
        ↓
LLM
        ↓
Grounded Movie Answer
```

## Monorepo Structure

```text
moviora-ai/
  frontend/
    app/
    components/
    lib/
  backend/
    app/
      api/
      core/
      db/
      models/
      rag/
      schemas/
      services/
  docker-compose.yml
  README.md
```

## API Endpoints

```text
GET  /health
GET  /api/v1/movies/search?query=interstellar
GET  /api/v1/movies/{movie_id}
POST /api/v1/ai/chat
POST /api/v1/ai/recommend
```

## Local Setup

### 1. Clone and configure

```bash
cp .env.example .env
```

Add your keys later:

```text
TMDB_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 3. Run backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

### 4. Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## RAG Implementation Plan

1. Fetch movie metadata, reviews, cast, and similar movies from TMDb.
2. Convert movie data into clean text documents.
3. Chunk documents by movie, review group, plot, cast, awards, and trivia.
4. Generate embeddings with OpenAI or Gemini embeddings.
5. Store chunks and metadata in Chroma locally or Pinecone in production.
6. On user question, retrieve top-k chunks.
7. Send question and retrieved context to the LLM.
8. Return a grounded answer with source chunks.

## Resume Bullets

- Built Moviora AI, a full-stack RAG-powered movie intelligence platform using Next.js, FastAPI, PostgreSQL, and vector search.
- Implemented AI movie chat and recommendation endpoints with a retriever service designed for Chroma/Pinecone and OpenAI/Gemini integrations.
- Designed a cinematic, responsive frontend with movie search, detail pages, sentiment insights, dashboard analytics, and assistant workspace.
- Created Docker-ready backend infrastructure and a scalable monorepo structure suitable for deployment and CI/CD.

## Future Improvements

- TMDb live search and movie detail ingestion
- ChromaDB ingestion command for reviews and metadata
- OpenAI/Gemini answer generation with citations
- User authentication and watchlists
- Alembic migrations and PostgreSQL models
- CI workflow for frontend/backend checks
