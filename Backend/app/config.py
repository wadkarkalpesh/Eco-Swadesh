import os

class Settings:
    PORT: int = int(os.getenv("PORT", 5000))
    JWT_SECRET: str = os.getenv("JWT_SECRET", "deccan_origin_jwt_secret_key_2026_prod")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://xyz-deccan-origin.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "anon-key-deccan-origin-2026")
    ENVIRONMENT: str = os.getenv("NODE_ENV", "production")

settings = Settings()
