from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    name: str


class UserRead(BaseModel):
    id: int
    email: str
    name: str

    model_config = {"from_attributes": True}


class SavedMovieCreate(BaseModel):
    user_id: int = 1
    movie_id: str
    title: str
    poster: str = ""
    rating: str = ""


class SavedMovieRead(BaseModel):
    id: int
    user_id: int
    movie_id: str
    title: str
    poster: str
    rating: str

    model_config = {"from_attributes": True}


class ChatSessionCreate(BaseModel):
    user_id: int | None = None
    movie_id: str | None = None
    title: str = "Movie chat"


class ChatSessionRead(BaseModel):
    id: int
    user_id: int | None
    movie_id: str | None
    title: str

    model_config = {"from_attributes": True}


class ChatMessageCreate(BaseModel):
    session_id: int
    role: str
    content: str


class ChatMessageRead(BaseModel):
    id: int
    session_id: int
    role: str
    content: str

    model_config = {"from_attributes": True}
