import React from "react";
import { MoveIcon, Info } from "lucide-react";

const GameBoard = ({
  phase,
  timeLeft,
  positions,
  playerPositions,
  availableIcons,
  onDragStart,
  onDrop,
  onComplete,
}) => {
  if (phase === "memorize") {
    return (
      <div className="text-center">
        <h3 className="text-xl mb-4">Memorize the positions! ({timeLeft}s)</h3>
        <div className="grid grid-cols-3 gap-4">
          {positions.map((icon, idx) => (
            <div key={idx} className="border p-4 text-4xl">
              {icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl mb-4">Place the icons in correct positions</h3>

      {/* Tip box */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mb-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Tip:</span> You can drag icons
            between positions to rearrange them. Once placed, icons can be moved
            to different positions if you change your mind.
          </p>
        </div>
      </div>

      {/* Grid for icon placement */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {playerPositions.map((pos, idx) => (
          <div
            key={idx}
            className={`
              border-2 p-4 min-h-20 
              flex items-center justify-center
              ${
                pos
                  ? "border-blue-200 hover:border-blue-400"
                  : "border-dashed border-gray-300"
              } 
              rounded-lg transition-colors duration-200
              ${pos ? "bg-white" : "bg-gray-50"}
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(idx)}
          >
            {pos ? (
              <div
                className="relative cursor-move group"
                draggable
                onDragStart={() => onDragStart(pos, idx)}
              >
                <div className="text-4xl">{pos}</div>
                {/* Drag indicator on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-blue-500/10 rounded-full p-1">
                    <MoveIcon className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                {/* <ArrowsUpDownIcon className="h-6 w-6 mb-1" /> */}
                <span className="text-sm">Drop here</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Available icons */}
      {availableIcons.length > 0 && (
        <div className="flex gap-2 mb-4">
          {availableIcons.map((icon, idx) => (
            <div
              key={idx}
              className="border-2 border-gray-200 p-3 text-2xl cursor-move rounded-lg
                        hover:border-blue-400 hover:bg-blue-50 transition-colors
                        group relative"
              draggable
              onDragStart={() => onDragStart(icon)}
            >
              {icon}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-500/10 rounded-full p-1">
                  <MoveIcon className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete button */}
      {!availableIcons.length && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            All icons placed! You can still rearrange them by dragging if
            needed.
          </p>
          <button
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg
                     transition-colors duration-200"
          >
            Continue to Place Coins
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
