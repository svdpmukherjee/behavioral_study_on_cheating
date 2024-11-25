import React, { useState } from "react";
import { MoveIcon, ExternalLink } from "lucide-react";
import CoinIcon from "../CoinIcon";

const SelfEvaluation = ({
  positions,
  playerPositions,
  selfReportedCorrect,
  onPositionReport,
  onSubmit,
  hasSubmittedReport,
  finalScore,
  onComplete,
  onEvaluationDragStart,
  onEvaluationDrop,
  placedCoins,
}) => {
  const [surveyCode, setSurveyCode] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const handleSurveyCodeSubmit = () => {
    // You can modify this validation as needed
    if (surveyCode.trim().toLowerCase() === "12345") {
      setShowScore(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl mb-4">Original Arrangement</h3>
        <div className="grid grid-cols-3 gap-4">
          {positions.map((icon, idx) => (
            <div key={idx} className="border p-4">
              <div className="text-4xl">{icon}</div>
              <div className="text-sm">Position {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-xl mb-4">Your Solution</h3>
        <div className="grid grid-cols-3 gap-4">
          {playerPositions.map((icon, idx) => (
            <div
              key={idx}
              className="border-2 p-4 cursor-move border-blue-200 hover:border-blue-400 rounded-md"
              draggable
              onDragStart={() => onEvaluationDragStart(icon, idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onEvaluationDrop(idx)}
            >
              <div className="text-4xl">{icon}</div>
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
            </div>
          ))}
        </div>
      </div>

      {!hasSubmittedReport ? (
        <div className="border-t pt-4">
          <h3 className="text-xl mb-4">
            Select the positions you solved correctly:
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onPositionReport(idx)}
                  className={`border p-4 transition-colors ${
                    selfReportedCorrect.has(idx) ? "bg-green-100" : "bg-white"
                  }`}
                >
                  <div className="text-lg font-medium">Position {idx + 1}</div>
                  <div className="text-sm mt-2">
                    {selfReportedCorrect.has(idx)
                      ? "Marked Correct"
                      : "Click if Correct"}
                  </div>
                </button>
              ))}
          </div>
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Your Evaluation
          </button>
        </div>
      ) : (
        <div className="border-t pt-4">
          <h3 className="text-xl mb-4">Next Steps</h3>

          {!showScore ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Complete Survey to See Your Reward
                </h4>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li>
                    Click the button below to open the survey in a new tab
                  </li>
                  <li>Complete all questions in the survey</li>
                  <li>Copy the completion code shown at the end</li>
                  <li>Return here and enter the code to see your reward</li>
                </ol>
              </div>

              <div className="flex justify-center">
                <a
                  href="https://ulsurvey.uni.lu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Open Survey
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </div>

              <div className="max-w-md mx-auto mt-6">
                <div className="space-y-3">
                  <label className="block text-gray-700">
                    Enter Survey Completion Code:
                  </label>
                  <input
                    type="text"
                    value={surveyCode}
                    onChange={(e) => {
                      setSurveyCode(e.target.value);
                      setCodeError(false);
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                      ${codeError ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter code from survey"
                  />
                  {codeError && (
                    <p className="text-red-500 text-sm">
                      Invalid code. Please complete the survey and enter the
                      correct code.
                    </p>
                  )}
                  <button
                    onClick={handleSurveyCodeSubmit}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Submit Code
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-3">
                  Survey Completed Successfully!
                </h4>
                <div className="text-xl font-bold mb-4">
                  Your reward: {finalScore}¢
                </div>
              </div>

              <button
                onClick={onComplete}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Complete Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelfEvaluation;
