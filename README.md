# Moviora AI

Moviora AI is a full-stack AI movie intelligence platform. It lets users search movies, open rich movie detail pages, ask an AI assistant grounded with movie context, and save films to a personal library.

The project is built as a resume-ready production-style app with a Next.js frontend, FastAPI backend, PostgreSQL database, OMDb movie data, OpenAI responses, Docker-based local database setup, and a local vector retrieval layer for movie knowledge.

![Moviora AI Home](docs/screenshots/home.png)

## Features

- Movie search powered by OMDb
- Dynamic movie detail pages with poster, cast, rating, runtime, genre, and plot
- AI movie assistant for story, cast, filming location, ratings, comparisons, and recommendations
- Retrieval flow that gives the assistant movie context before generating answers
- Simple signup with name and email
- Personal saved movie library
- Chat session and message storage in PostgreSQL
- Docker Compose setup for PostgreSQL
- Responsive dark cinematic UI built with Next.js and Tailwind CSS

## Screenshots

### Movie Discovery

![Movie Discovery](docs/screenshots/home.png)

### AI Assistant

![AI Assistant](docs/screenshots/assistant.png)

### Movie Detail Page

![Movie Detail](docs/screenshots/movie-detail.png)

### Signup

![Signup](docs/screenshots/signup.png)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, Pydantic |
| AI | OpenAI API |
| Movie Data | OMDb API |
| Database | PostgreSQL, SQLAlchemy |
| Vector Retrieval | Local vector-style movie chunk store |
| DevOps | Docker Compose |

## How It Works

```text
User searches or asks a movie question
        ?
Next.js frontend sends request to FastAPI
        ?
Backend fetches movie data from OMDb or stored movie chunks
        ?
Retriever selects relevant movie context
        ?
OpenAI generates a grounded answer
        ?
PostgreSQL stores users, saved movies, chat sessions, and messages
```

## Project Structure

```text
moviora-ai/
  backend/
    app/
      api/          FastAPI routes
      core/         Settings and config
      db/           Database session
      models/       SQLAlchemy models
      rag/          Retrieval and vector store logic
      schemas/      Pydantic schemas
      services/     OMDb movie service
  frontend/
    app/            Next.js app routes
    components/     UI components
    lib/            API clients and auth helpers
  docs/
    screenshots/    README screenshots
  docker-compose.yml
  README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/moviora-ai.git
cd moviora-ai
```

### 2. Create environment file

Copy the example file:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Add your keys:

```env
OPENAI_API_KEY=your_openai_api_key
OMDB_API_KEY=your_omdb_api_key
DATABASE_URL=postgresql+psycopg://moviora:moviora@localhost:5432/moviora
VECTOR_DB_PATH=./.chroma
APP_ENV=development
```

### 3. Start PostgreSQL with Docker

```bash
docker compose up -d postgres
```

Database credentials:

```text
Host: localhost
Port: 5432
Database: moviora
User: moviora
Password: moviora
```

### 4. Run the backend

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

Initialize database tables:

```bash
curl -X POST http://localhost:8000/api/v1/db/init
```

### 5. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## Main API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/health` | Backend health check |
| GET | `/api/v1/movies/search?query=titanic` | Search movies from OMDb |
| GET | `/api/v1/movies/{movie_id}` | Get movie details |
| POST | `/api/v1/ai/chat` | Ask the AI movie assistant |
| POST | `/api/v1/db/init` | Create database tables |
| POST | `/api/v1/db/users` | Create or fetch a simple user profile |
| POST | `/api/v1/db/watchlist` | Save a movie |
| GET | `/api/v1/db/watchlist/{user_id}` | Get saved movies |
| POST | `/api/v1/rag/ingest/movie/{movie_id}` | Store movie chunks for retrieval |
| GET | `/api/v1/rag/search?query=...` | Search retrieved movie chunks |

## Database Design

PostgreSQL stores structured application data:

- `users` - simple user profiles
- `saved_movies` - user watchlist items
- `chat_sessions` - AI conversation sessions
- `chat_messages` - user and assistant messages
- `movie_chunks` - stored movie context chunks

The local vector store keeps searchable movie knowledge chunks for retrieval before AI response generation.

## Resume Highlights

- Built a full-stack AI movie intelligence platform using Next.js, FastAPI, PostgreSQL, Docker, and OpenAI.
- Integrated OMDb movie search and dynamic detail pages with AI-powered movie explanations and recommendations.
- Implemented PostgreSQL persistence for user profiles, watchlists, chat sessions, and assistant messages.
- Designed a retrieval-based assistant flow that grounds AI answers with movie metadata and stored knowledge chunks.
- Created a responsive cinematic UI with dashboard, assistant workspace, saved movies, and movie discovery pages.

## Future Improvements

- Replace the local vector-style store with production ChromaDB or Pinecone
- Add passwordless email login or OAuth
- Add admin analytics dashboard
- Add CI/CD with GitHub Actions
- Deploy frontend on Vercel and backend on Render/Railway
- Use hosted PostgreSQL such as Neon or Supabase

## Author

Made by Lovely Gupta as a portfolio project for full-stack AI engineering practice.
