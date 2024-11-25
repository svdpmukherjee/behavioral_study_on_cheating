import React, { useState } from "react";
import Container from "./Container";
import CoinIcon from "./CoinIcon";

const ConsentPage = ({ onConsent }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleExit = () => {
    window.location.href = "https://www.prolific.co";
  };

  return (
    <Container>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Informed Consent
        </h2>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            1. Study Procedure and Compensation
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              This study will take approximately
              <span className="inline-flex items-center mx-1 font-semibold">
                10 minutes
              </span>
              to complete and you will receive
              <span className="inline-flex items-center mx-1 font-semibold">
                £2
              </span>
              for your participation.
            </li>
            <li>
              At first, you will participate in a memory game where you will
              need to remember and reconstruct the positions of various icons.
            </li>
            <li>
              For each correct position, you can earn additional rewards by
              placing confidence bets:
              <ul className="list-circle pl-5 mt-2 space-y-1">
                <li className="flex items-center">
                  High confidence bet (
                  <CoinIcon className="h-6 w-6 text-yellow-600 mx-1" />
                  5)
                </li>
                <li className="flex items-center">
                  Medium confidence bet (
                  <CoinIcon className="h-6 w-6 text-yellow-600 mx-1" />
                  2)
                </li>
                <li className="flex items-center">
                  Low confidence bet (
                  <CoinIcon className="h-6 w-6 text-yellow-600 mx-1" />
                  1)
                </li>
              </ul>
            </li>
            <li>
              If you solve
              <span className="inline-flex items-center mx-1 font-semibold">
                at least four positions correctly
              </span>
              , you will receive the values of your placed coins as an
              additional reward on top of your participation fee.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            2. Post-Game Survey
          </h3>
          <p className="text-gray-700">
            After completing the memory game, you will be asked to fill out a
            brief survey about your experience and general feedback about the
            task.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            3. Data Collection and Privacy
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              We will collect:
              <ul className="list-circle pl-5 mt-2 space-y-1">
                <li>Your responses and interactions during the memory game</li>
                <li>Response times and confidence ratings</li>
                <li>Your survey responses</li>
                <li>Your demography data</li>
              </ul>
            </li>
            <li>
              All data will be{" "}
              <span className="font-semibold">strictly anonymized</span> and
              securely stored on servers at the University of Luxembourg.
            </li>
            <li>
              Only authorized researchers will have access to the anonymized
              data.
            </li>
          </ul>
        </section>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="consent"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="consent" className="ml-2 text-gray-700">
              I have read and understood the above information and agree to
              participate in this study.
            </label>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onConsent}
              disabled={!isChecked}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-300
                ${
                  isChecked
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              I Agree, Continue
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all duration-300"
            >
              I do not want to participate
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ConsentPage;
