from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.db.session import engine, get_db
from app.models import Base, ChatMessage, ChatSession, SavedMovie, User
from app.schemas.db import (
    ChatMessageCreate,
    ChatMessageRead,
    ChatSessionCreate,
    ChatSessionRead,
    SavedMovieCreate,
    SavedMovieRead,
    UserCreate,
    UserRead,
)

router = APIRouter()


@router.post("/init")
def init_database() -> dict[str, str]:
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=503, detail=f"Database not available: {exc}") from exc
    return {"status": "ok", "message": "PostgreSQL tables are ready"}


@router.post("/users", response_model=UserRead)
def create_user(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        existing_user.name = payload.name
        db.commit()
        db.refresh(existing_user)
        return existing_user

    user = User(email=payload.email, name=payload.name)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        user = db.query(User).filter(User.email == payload.email).first()
        if user is None:
            raise
        return user
    db.refresh(user)
    return user


@router.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/watchlist", response_model=SavedMovieRead)
def save_movie(payload: SavedMovieCreate, db: Session = Depends(get_db)) -> SavedMovie:
    existing = (
        db.query(SavedMovie)
        .filter(SavedMovie.user_id == payload.user_id, SavedMovie.movie_id == payload.movie_id)
        .first()
    )
    if existing:
        existing.title = payload.title
        existing.poster = payload.poster
        existing.rating = payload.rating
        db.commit()
        db.refresh(existing)
        return existing

    saved = SavedMovie(**payload.model_dump())
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


@router.get("/watchlist/{user_id}", response_model=list[SavedMovieRead])
def get_watchlist(user_id: int, db: Session = Depends(get_db)) -> list[SavedMovie]:
    return db.query(SavedMovie).filter(SavedMovie.user_id == user_id).order_by(SavedMovie.id.desc()).all()


@router.post("/chat-sessions", response_model=ChatSessionRead)
def create_chat_session(payload: ChatSessionCreate, db: Session = Depends(get_db)) -> ChatSession:
    session = ChatSession(**payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/chat-messages", response_model=ChatMessageRead)
def save_chat_message(payload: ChatMessageCreate, db: Session = Depends(get_db)) -> ChatMessage:
    message = ChatMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/chat-sessions/{session_id}/messages", response_model=list[ChatMessageRead])
def get_chat_messages(session_id: int, db: Session = Depends(get_db)) -> list[ChatMessage]:
    return db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.id.asc()).all()


@router.get("/users/{user_id}/chat-sessions", response_model=list[ChatSessionRead])
def get_user_chat_sessions(user_id: int, db: Session = Depends(get_db)) -> list[ChatSession]:
    return db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.id.desc()).all()
