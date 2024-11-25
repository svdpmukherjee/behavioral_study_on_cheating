from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class GameConfig(BaseModel):
    icons: List[str]
    coins: List[Dict[str, int]]

class Metadata(BaseModel):
    userAgent: str
    screenSize: Dict[str, int]
    language: str
    platform: str
    timestamp: str

class SessionInit(BaseModel):
    prolificId: str
    startTime: str
    metadata: Metadata

class GameAction(BaseModel):
    sessionId: str
    prolificId: str
    timestamp: str
    gamePhase: str
    action: Dict[str, Any]

class GameData(BaseModel):
    theoryId: str
    startTime: str
    endTime: str
    originalPositions: List[str]
    finalPositions: List[str]
    coinPlacements: List[Optional[int]]
    selfReported: List[int]
    actualCorrect: List[int]
    honestReporting: bool
    score: int

class GameResult(BaseModel):
    sessionId: str
    prolificId: str
    gameData: GameData

class SessionData(BaseModel):
    startTime: str
    completionTime: str
    totalDuration: int

class SessionComplete(BaseModel):
    sessionId: str
    prolificId: str
    sessionData: SessionData