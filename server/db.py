# server/db.py

import sys
from .config import MONGODB_URI, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient

# Create a MongoDB client using the connection URI from config
client = AsyncIOMotorClient(MONGODB_URI)

# Connect to the database name from config
db = client[DB_NAME]

# Reference your collections
users_collection = db["users"]
scores_collection = db["scores"]

async def setup_indexes():
    """
    Ensure we have the right indexes for fast lookups.
    """
    # index on email for quick user-based score searches
    await scores_collection.create_index("email")
    # descending on score for leaderboard sorting
    await scores_collection.create_index([("score", -1)])

async def test_connection():
    """
    Ping the server on startup to verify connectivity.
    """
    try:
        await client.admin.command("ping")
        print("✅ Successfully connected to MongoDB!")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}", file=sys.stderr)
        # Re-raise so your app stops if it can’t connect
        raise
