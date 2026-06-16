from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SavedMovie(Base):
    __tablename__ = "saved_movies"
    __table_args__ = (UniqueConstraint("user_id", "movie_id", name="uq_saved_movie_user_movie"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(index=True)
    movie_id: Mapped[str] = mapped_column(String(80), index=True)
    title: Mapped[str] = mapped_column(String(255))
    poster: Mapped[str] = mapped_column(Text, default="")
    rating: Mapped[str] = mapped_column(String(40), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(index=True, nullable=True)
    movie_id: Mapped[str] = mapped_column(String(80), index=True, nullable=True)
    title: Mapped[str] = mapped_column(String(255), default="Movie chat")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(index=True)
    role: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class MovieChunk(Base):
    __tablename__ = "movie_chunks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    movie_id: Mapped[str] = mapped_column(String(80), index=True)
    movie_title: Mapped[str] = mapped_column(String(255), index=True)
    source: Mapped[str] = mapped_column(String(80), default="manual")
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

