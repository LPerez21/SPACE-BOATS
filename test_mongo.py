# test_mongo.py

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

URI = "mongodb+srv://housemouse1801:YourCorrectPasswordHere@database.juhuslw.mongodb.net/space-boats-db?retryWrites=true&w=majority"

async def main():
    client = AsyncIOMotorClient(URI)
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connection successful!")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
