# Import the MongoClient class from the pymongo library to connect to MongoDB
from pymongo import MongoClient

# Import the MongoDB URI and database name from your config file
from config import MONGODB_URI, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient 

# Create a MongoDB client using the connection URI
client = AsyncIOMotorClient(MONGODB_URI)

# Connect to the specific database using the name from the config
db = client[DB_NAME]

# Reference the "users" collection in the database
users_collection = db["users"]

# Reference the "scores" collection in the database
scores_collection = db["scores"]

async def setup_indexes():
    await scores_collection.create_index("email")
    await scores_collection.create_index([("score", -1)])

async def test_connection():
    try:
        # Attempt to retrieve the server information
        await client.admin.command('ping')
        print("Working on MongoDB connection...")
    except Exception as e:
        print("Failed to connect to MongoDB:", e)