from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import random
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

class TestSubmission(BaseModel):
    answer: str
    mouseData: list
    tabFocus: bool
    timeLeft: int

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = AsyncIOMotorClient("mongodb+srv://svdpmukherjee:mongodb_110789@cluster1.bybvc.mongodb.net/")
    app.mongodb = app.mongodb_client.behavioral_study_cheating
    yield
    # Shutdown
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Aptitude Test API"}

@app.get("/api/question")
async def get_question():
    questions = [
        "Mrs. Alina Koenig decided to distribute some candies among her friends. She gave half of her total stock of candies plus one extra candy to the first friend. To the second friend, she gave half of what remained, plus one more. She continued distributing the candies in this manner. After giving candy to 6 friends, her entire stock was exhausted. How many candies did she have initially?"
    ]
    return {"question": questions}

@app.post("/api/submit")
async def submit_answer(request: Request):
    print("Received data:", await request.json())  # Debug print
    submission = TestSubmission(**(await request.json()))
    submission_dict = submission.model_dump()
    submission_dict["_id"] = str(ObjectId())
    
    result = await app.mongodb.cheaters.insert_one(submission_dict)
    
    if result.inserted_id:
        return {"message": "Submission received successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to save submission")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)