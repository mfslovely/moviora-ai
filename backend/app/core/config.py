from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://moviora:moviora@localhost:5432/moviora"
    tmdb_api_key: str = ""
    openai_api_key: str = ""
    gemini_api_key: str = ""
    vector_db_path: str = "./.chroma"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
