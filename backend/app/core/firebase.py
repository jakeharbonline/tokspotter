"""
Firebase Admin SDK initialization and utilities.
"""
import firebase_admin
from firebase_admin import credentials, firestore, auth
from .config import settings
from typing import Optional


class FirebaseClient:
    """Singleton Firebase client for database and auth operations."""

    _instance: Optional['FirebaseClient'] = None
    _initialized: bool = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._initialize()
            FirebaseClient._initialized = True

    def _initialize(self):
        """Initialize Firebase Admin SDK."""
        try:
            cred = credentials.Certificate(settings.firebase_credentials)
            firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}")
            raise

    def get_db(self):
        """Get Firestore database client."""
        return self.db

    async def verify_token(self, token: str) -> dict:
        """Verify Firebase ID token and return user info."""
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            print(f"Token verification failed: {e}")
            raise


# Global Firebase client instance
firebase_client = FirebaseClient()
