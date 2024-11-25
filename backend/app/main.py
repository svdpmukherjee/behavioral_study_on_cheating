from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import json
import os
from dotenv import load_dotenv

from app.models.schemas import (
    GameConfig, SessionInit, GameAction, GameResult, 
    SessionComplete, GameData, SessionData
)

# Load environment variables
load_dotenv()

app = FastAPI(title="Memory Game Backend", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")

if not MONGODB_URI or not MONGODB_DB_NAME:
    raise ValueError("MongoDB environment variables not set!")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]

def load_config():
    """Load configuration from JSON file"""
    try:
        config_path = os.path.join(os.path.dirname(__file__), 'config', 'theories.json')
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        return None

def init_db():
    """Initialize database with theories and config if not exists"""
    try:
        config = load_config()
        if not config:
            return

        if db.theories.count_documents({}) == 0:
            db.theories.insert_many(config['theories'])
            print("Theories initialized in database")

        if db.game_config.count_documents({}) == 0:
            db.game_config.insert_one(config['game_config'])
            print("Game config initialized in database")

    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

# Initialize database on startup
init_db()

@app.get("/api/ping")
async def ping():
    """Health check endpoint"""
    try:
        # Test database connection
        db.command('ping')
        return {"status": "healthy", "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.post("/api/initialize-session")
async def initialize_session(data: SessionInit):
    """Initialize a new session for a participant"""
    try:
        session_data = {
            "prolificId": data.prolificId,
            "startTime": data.startTime,
            "metadata": data.metadata.dict(),
            "status": "active",
            "createdAt": datetime.utcnow()
        }
        
        result = db.sessions.insert_one(session_data)
        
        return {
            "sessionId": str(result.inserted_id),
            "status": "success"
        }
    except Exception as e:
        print(f"Error initializing session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/theory")
async def get_next_theory():
    """Get next theory based on shown count"""
    try:
        theory = db.theories.find_one(
            sort=[("shown_count", 1)],
            projection={"_id": 0}
        )
        
        if not theory:
            raise HTTPException(status_code=404, detail="No theories found")
        
        # Update shown count
        db.theories.update_one(
            {"id": theory["id"]},
            {"$inc": {"shown_count": 1}}
        )
        
        return theory
    except Exception as e:
        print(f"Error getting theory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/game-config")
async def get_game_config():
    """Get game configuration"""
    try:
        config = db.game_config.find_one({}, {"_id": 0})
        if not config:
            config = load_config()['game_config']
        return config
    except Exception as e:
        print(f"Error getting game config: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/log-action")
async def log_action(data: GameAction):
    """Log individual game actions"""
    try:
        action_data = data.dict()
        action_data["timestamp"] = datetime.utcnow()
        
        result = db.actions.insert_one(action_data)
        
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        print(f"Error logging action: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/game-results")
async def save_game_results(data: GameResult):
    """Save complete game results"""
    try:
        result_data = data.dict()
        result_data["timestamp"] = datetime.utcnow()
        
        # Save game results
        result = db.game_results.insert_one(result_data)
        
        # Update session status
        db.sessions.update_one(
            {"_id": ObjectId(data.sessionId)},
            {
                "$set": {
                    "gameCompleted": True,
                    "gameCompletedAt": datetime.utcnow(),
                    "score": data.gameData.score
                }
            }
        )
        
        return {"status": "success", "id": str(result.inserted_id)}
    except Exception as e:
        print(f"Error saving game results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complete-session")
async def complete_session(data: SessionComplete):
    """Mark session as completed and save final data"""
    try:
        completion_data = data.sessionData.dict()
        completion_data["completedAt"] = datetime.utcnow()
        
        db.sessions.update_one(
            {"_id": ObjectId(data.sessionId)},
            {
                "$set": {
                    "status": "completed",
                    "completionData": completion_data
                }
            }
        )
        
        return {"status": "success"}
    except Exception as e:
        print(f"Error completing session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/terminate-session")
async def terminate_session(sessionId: str, reason: str = "user_terminated"):
    """Handle early session termination"""
    try:
        db.sessions.update_one(
            {"_id": ObjectId(sessionId)},
            {
                "$set": {
                    "status": "terminated",
                    "terminationReason": reason,
                    "terminatedAt": datetime.utcnow()
                }
            }
        )
        return {"status": "success"}
    except Exception as e:
        print(f"Error terminating session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/statistics")
async def get_statistics():
    """Get study statistics"""
    try:
        stats = {
            "total_participants": db.sessions.count_documents({}),
            "completed_sessions": db.sessions.count_documents({"status": "completed"}),
            "active_sessions": db.sessions.count_documents({"status": "active"}),
            "terminated_sessions": db.sessions.count_documents({"status": "terminated"}),
            "theory_distribution": list(db.theories.find({}, {
                "_id": 0, 
                "id": 1, 
                "shown_count": 1
            })),
            "average_score": await db.sessions.aggregate([
                {"$match": {"gameCompleted": True}},
                {"$group": {"_id": None, "avg_score": {"$avg": "$score"}}}
            ]).next()
        }
        return stats
    except Exception as e:
        print(f"Error getting statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# For development/testing
@app.post("/api/reset-counts")
async def reset_shown_counts():
    """Reset all theory shown counts to 0"""
    try:
        result = db.theories.update_many({}, {"$set": {"shown_count": 0}})
        return {
            "status": "success",
            "message": f"Reset {result.modified_count} theories"
        }
    except Exception as e:
        print(f"Error resetting counts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)