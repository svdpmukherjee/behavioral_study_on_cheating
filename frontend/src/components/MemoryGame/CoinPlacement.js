import React from "react";
import CoinIcon from "../CoinIcon";

const CoinPlacement = ({
  playerPositions,
  availableCoins,
  placedCoins,
  onCoinPlace,
  onComplete,
  getCoinButtonState,
}) => {
  return (
    <div>
      <h3 className="text-xl mb-4">Rate your confidence with coins</h3>
      <div className="mb-4 flex items-center">
        <span>Available coins:</span>
        <div className="flex flex-wrap items-center ml-2 text-sm">
          {availableCoins.map((coin) => (
            <div key={coin.value} className="flex items-center mr-4 mb-2">
              <CoinIcon className="h-6 w-6 text-yellow-600 mr-1" />
              <span>
                {coin.value}: {coin.count} left
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {playerPositions.map((pos, idx) => (
          <div key={idx} className="border p-4">
            <div className="text-4xl mb-2">{pos}</div>
            {/* <div className="text-sm">
              Selected: {placedCoins[idx] ? <CoinIcon className="h-6 w-6 text-green-600" />`${placedCoins[idx]}` : "None"}
            </div> */}
            <div className="text-sm flex items-center">
              <span>Selected: </span>
              {placedCoins[idx] ? (
                <div className="flex items-center">
                  <CoinIcon className="h-6 w-6 text-yellow-600 mr-1" />
                  {placedCoins[idx]}
                </div>
              ) : (
                "0"
              )}
            </div>
            <div className="flex gap-1 mt-2">
              {[20, 10, 5].map((value) => {
                const buttonState = getCoinButtonState(idx, value);
                return (
                  <button
                    key={value}
                    onClick={() => onCoinPlace(idx, value)}
                    className={`px-2 py-1 text-xs rounded ${
                      buttonState === "selected"
                        ? "bg-yellow-600 text-white"
                        : buttonState === "available"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`}
                    disabled={buttonState === "unavailable"}
                  >
                    {value}
                    {/* <CoinIcon className="h-6 w-6 text-green-600" /> */}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onComplete}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Next to see comparison
      </button>
    </div>
  );
};

export default CoinPlacement;
