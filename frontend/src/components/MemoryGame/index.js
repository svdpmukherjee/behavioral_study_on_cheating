import React, { useState, useEffect } from "react";
import TheoryDisplay from "./TheoryDisplay";
import GameBoard from "./GameBoard";
import CoinPlacement from "./CoinPlacement";
import SelfEvaluation from "./SelfEvaluation";
import { Info } from "lucide-react";

const icons = ["🌟", "🌍", "🌈", "🎵", "🎨", "🌺"];
const initialCoins = [
  { value: 20, count: 2 },
  { value: 10, count: 2 },
  { value: 5, count: 2 },
];

const MemoryGame = ({ prolificId, sessionId, onComplete }) => {
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  // Game state
  const [gamePhase, setGamePhase] = useState("loading");
  const [timeLeft, setTimeLeft] = useState(3);
  const [positions, setPositions] = useState([]);
  const [playerPositions, setPlayerPositions] = useState(Array(6).fill(null));
  const [availableIcons, setAvailableIcons] = useState([]);
  const [draggingIcon, setDraggingIcon] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Coin state
  const [availableCoins, setAvailableCoins] = useState([...initialCoins]);
  const [placedCoins, setPlacedCoins] = useState(Array(6).fill(null));

  // Evaluation state
  const [selfReportedCorrect, setSelfReportedCorrect] = useState(new Set());
  const [hasSubmittedReport, setHasSubmittedReport] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Theory state
  const [theory, setTheory] = useState(null);

  // Action logging
  const logAction = async (action) => {
    try {
      await fetch("http://localhost:8000/api/log-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          prolificId,
          timestamp: new Date().toISOString(),
          gamePhase,
          action,
        }),
      });
    } catch (error) {
      console.error("Action logging error:", error);
    }
  };

  // Fetch theory on mount
  useEffect(() => {
    const fetchTheory = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/theory");
        if (!response.ok) throw new Error("Failed to fetch theory");

        const data = await response.json();
        setTheory(data);
        setGamePhase("start");
      } catch (error) {
        console.error("Theory fetch error:", error);
        // Use fallback theory if fetch fails
        setTheory({
          id: "fallback",
          text: "Welcome to the Memory Game! Test your memory and confidence.",
        });
        setGamePhase("start");
      }
    };

    fetchTheory();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gamePhase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (gamePhase === "memorize" && timeLeft === 0) {
      setGamePhase("place");
      logAction({ type: "phase_change", from: "memorize", to: "place" });
    }
  }, [timeLeft, gamePhase]);

  // Game start handler
  const handleStartGame = async () => {
    const startTime = new Date().toISOString();
    setGameStartTime(startTime);

    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    setPositions(shuffled);
    setAvailableIcons([...icons]);
    setPlayerPositions(Array(6).fill(null));
    setPlacedCoins(Array(6).fill(null));
    setAvailableCoins([...initialCoins]);
    setSelfReportedCorrect(new Set());
    setHasSubmittedReport(false);
    setFinalScore(0);
    setTimeLeft(3);
    setGamePhase("memorize");

    await logAction({
      type: "game_start",
      timestamp: startTime,
      initialPositions: shuffled,
    });
  };

  // Icon placement handlers
  // const handleDragStart = (icon) => {
  //   setDraggingIcon(icon);
  //   logAction({
  //     type: "icon_drag_start",
  //     icon,
  //   });
  // };
  const handleDragStart = (icon, fromIndex = null) => {
    setDraggingIcon({
      icon,
      fromIndex, // Will be null for new icons, will have index for placed icons
    });
  };

  // const handleDrop = async (index) => {
  //   if (draggingIcon && playerPositions[index] === null) {
  //     const newPositions = [...playerPositions];
  //     newPositions[index] = draggingIcon;
  //     setPlayerPositions(newPositions);
  //     setAvailableIcons(availableIcons.filter((i) => i !== draggingIcon));

  //     await logAction({
  //       type: "icon_placed",
  //       icon: draggingIcon,
  //       position: index,
  //       remainingIcons: availableIcons.length - 1,
  //     });
  //   }
  // };
  const handleDrop = (toIndex) => {
    if (!draggingIcon) return;

    const newPositions = [...playerPositions];
    const newAvailableIcons = [...availableIcons];

    if (draggingIcon.fromIndex !== null) {
      // Swapping positions
      const temp = newPositions[toIndex];
      newPositions[draggingIcon.fromIndex] = temp;
      newPositions[toIndex] = draggingIcon.icon;
    } else {
      // New placement from available icons
      if (newPositions[toIndex] === null) {
        newPositions[toIndex] = draggingIcon.icon;
        newAvailableIcons.splice(
          newAvailableIcons.indexOf(draggingIcon.icon),
          1
        );
      }
    }
    setPlayerPositions(newPositions);
    setAvailableIcons(newAvailableIcons);
    setDraggingIcon(null);
  };

  // Evaluation phase handlers
  const handleEvaluationDragStart = (icon, index) => {
    setDraggingIcon({ icon, fromIndex: index });
    logAction({
      type: "evaluation_drag_start",
      icon,
      fromIndex: index,
    });
  };

  const handleEvaluationDrop = async (toIndex) => {
    if (!draggingIcon || draggingIcon.fromIndex === undefined) return;

    const fromIndex = draggingIcon.fromIndex;
    const newPositions = [...playerPositions];
    const fromIcon = newPositions[fromIndex];
    newPositions[fromIndex] = newPositions[toIndex];
    newPositions[toIndex] = fromIcon;

    const newPlacedCoins = [...placedCoins];
    const fromCoin = newPlacedCoins[fromIndex];
    newPlacedCoins[fromIndex] = newPlacedCoins[toIndex];
    newPlacedCoins[toIndex] = fromCoin;

    setPlayerPositions(newPositions);
    setPlacedCoins(newPlacedCoins);
    setDraggingIcon(null);

    await logAction({
      type: "position_swapped",
      fromIndex,
      toIndex,
      fromIcon,
      toIcon: newPositions[fromIndex],
    });
  };

  // Coin placement handler
  const handleCoinPlacement = async (index, coinValue) => {
    const newPlacedCoins = [...placedCoins];
    let newAvailableCoins = [...availableCoins];
    const previousCoin = placedCoins[index];

    if (placedCoins[index] === coinValue) {
      // Remove coin
      newAvailableCoins = newAvailableCoins.map((c) =>
        c.value === coinValue ? { ...c, count: c.count + 1 } : c
      );
      newPlacedCoins[index] = null;

      await logAction({
        type: "coin_removed",
        position: index,
        coinValue,
        previousCoin,
      });
    } else {
      // Place new coin
      const coinAvailable = newAvailableCoins.find(
        (c) => c.value === coinValue && c.count > 0
      );
      if (!coinAvailable) return;

      if (newPlacedCoins[index] !== null) {
        const oldCoinValue = newPlacedCoins[index];
        newAvailableCoins = newAvailableCoins.map((c) =>
          c.value === oldCoinValue ? { ...c, count: c.count + 1 } : c
        );
      }

      newPlacedCoins[index] = coinValue;
      newAvailableCoins = newAvailableCoins.map((c) =>
        c.value === coinValue ? { ...c, count: c.count - 1 } : c
      );

      await logAction({
        type: "coin_placed",
        position: index,
        coinValue,
        previousCoin,
        remainingCoins: newAvailableCoins,
      });
    }

    setPlacedCoins(newPlacedCoins);
    setAvailableCoins(newAvailableCoins);
  };

  const getCoinButtonState = (position, coinValue) => {
    const isSelected = placedCoins[position] === coinValue;
    const isAvailable =
      availableCoins.find((c) => c.value === coinValue)?.count > 0;

    if (isSelected) return "selected";
    if (isAvailable) return "available";
    return "unavailable";
  };

  // Self evaluation handlers
  const handleSelfEvaluation = async () => {
    // Calculate which positions are actually correct
    const actualCorrect = positions.reduce(
      (acc, pos, idx) => (pos === playerPositions[idx] ? [...acc, idx] : acc),
      []
    );

    // Calculate score based on coins placed on correctly matched positions
    const totalScore =
      actualCorrect.length >= 3
        ? actualCorrect.reduce((acc, pos) => acc + (placedCoins[pos] || 0), 0)
        : 0;

    try {
      await fetch("http://localhost:8000/api/game-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          prolificId,
          gameData: {
            theoryId: theory.id,
            startTime: gameStartTime,
            endTime: new Date().toISOString(),
            originalPositions: positions,
            finalPositions: playerPositions,
            coinPlacements: placedCoins,
            selfReported: Array.from(selfReportedCorrect),
            actualCorrect,
            score: totalScore, // Use the actual score based on correct positions
            honestReporting:
              JSON.stringify(Array.from(selfReportedCorrect).sort()) ===
              JSON.stringify(actualCorrect.sort()),
          },
        }),
      });

      setFinalScore(totalScore); // Set the actual score
      setHasSubmittedReport(true);

      await logAction({
        type: "game_completed",
        actualCorrect,
        selfReported: Array.from(selfReportedCorrect),
        score: totalScore,
        correctCount: actualCorrect.length,
      });
    } catch (error) {
      console.error("Error saving game results:", error);
      setFinalScore(totalScore);
      setHasSubmittedReport(true);
    }
  };

  // Phase change handler
  const handlePhaseChange = async (newPhase) => {
    await logAction({
      type: "phase_change",
      from: gamePhase,
      to: newPhase,
    });
    setGamePhase(newPhase);
  };

  return (
    <div className="space-y-6">
      <TheoryDisplay theory={theory} />
      <div className="p-2"></div>

      {gamePhase === "start" && (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              id="readConfirmation"
              checked={hasReadInstructions}
              onChange={() => setHasReadInstructions(!hasReadInstructions)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="readConfirmation" className="text-gray-700">
              I confirm that I have read and understood the instructions
            </label>
          </div>

          <button
            onClick={handleStartGame}
            disabled={!hasReadInstructions}
            className={`
        inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300
        ${
          hasReadInstructions
            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
          >
            Start Game
          </button>
        </div>
      )}

      {gamePhase === "memorize" && (
        <GameBoard phase="memorize" positions={positions} timeLeft={timeLeft} />
      )}

      {gamePhase === "place" && (
        <GameBoard
          phase="place"
          playerPositions={playerPositions}
          availableIcons={availableIcons}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onComplete={() => handlePhaseChange("rate")}
        />
      )}

      {gamePhase === "rate" && (
        <CoinPlacement
          playerPositions={playerPositions}
          availableCoins={availableCoins}
          placedCoins={placedCoins}
          onCoinPlace={handleCoinPlacement}
          onComplete={() => handlePhaseChange("evaluate")}
          getCoinButtonState={getCoinButtonState}
        />
      )}

      {gamePhase === "evaluate" && (
        <SelfEvaluation
          positions={positions}
          playerPositions={playerPositions}
          placedCoins={placedCoins}
          selfReportedCorrect={selfReportedCorrect}
          onPositionReport={async (idx) => {
            const newReported = new Set(selfReportedCorrect);
            const wasReported = newReported.has(idx);

            if (wasReported) {
              newReported.delete(idx);
            } else {
              newReported.add(idx);
            }

            setSelfReportedCorrect(newReported);

            await logAction({
              type: "position_reported",
              position: idx,
              action: wasReported ? "unmarked" : "marked",
              totalReported: newReported.size,
            });
          }}
          onSubmit={handleSelfEvaluation}
          hasSubmittedReport={hasSubmittedReport}
          finalScore={finalScore}
          onComplete={onComplete}
          onEvaluationDragStart={handleEvaluationDragStart}
          onEvaluationDrop={handleEvaluationDrop}
        />
      )}

      {/* Error boundary */}
      <div id="error-boundary" style={{ display: "none" }}>
        <div className="text-center p-4">
          <p className="text-red-600">
            An error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
