import React from "react";
import { Info, Star, ChevronsRight } from "lucide-react";
import Container from "./Container";
import CoinIcon from "./CoinIcon";

// const CoinIcon = ({ className }) => (
//   <svg viewBox="0 0 24 24" className={className} fill="currentColor">
//     <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="2"
//       fill="none"
//     />
//     <text
//       x="12"
//       y="14"
//       fontSize="8"
//       textAnchor="middle"
//       fill="currentColor"
//       fontWeight="bold"
//     >
//       p
//     </text>
//   </svg>
// );

const LandingPage = ({ onStartStudy }) => {
  return (
    <Container>
      <div className="text-center mb-8">
        {/* <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Memory and Confidence Game
        </h1> */}
        <p className="text-gray-600">
          Test your memory skills and earn rewards!
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Game Overview */}
        <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Quick Overview
          </h2>
          <p className="text-gray-700">
            In this game, you will test both your memory accuracy and your
            ability to judge your own confidence. The better you perform and the
            more accurately you assess your confidence, the more rewards you can
            earn!
          </p>
        </section>
        {/* Game Flow */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            How to Play
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Memorization Phase
                </h3>
                <p className="text-gray-600">
                  You will see a grid of 6 different icons for 3 seconds. Pay
                  close attention to each icon's position!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Reconstruction Phase
                </h3>
                <p className="text-gray-600">
                  After the icons disappear, recreate their positions by
                  dragging each icon to where you remember seeing it.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">
                  Confidence Rating
                </h3>
                <p className="text-gray-600">
                  Place confidence bets using coins (valued in pence):
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-gray-600 h-8">
                    <div className="flex items-center mr-2">
                      <CoinIcon className="h-6 w-6 text-yellow-600" />
                      <span className="ml-1 font-semibold">5</span>
                    </div>
                    for high confidence
                  </li>
                  <li className="flex items-center text-gray-600 h-8">
                    <div className="flex items-center mr-2">
                      <CoinIcon className="h-6 w-6 text-yellow-600" />
                      <span className="ml-1 font-semibold">2</span>
                    </div>
                    for medium confidence
                  </li>
                  <li className="flex items-center text-gray-600 h-8">
                    <div className="flex items-center mr-2">
                      <CoinIcon className="h-6 w-6 text-yellow-600" />
                      <span className="ml-1 font-semibold">1</span>
                    </div>
                    for low confidence
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Rewards Section */}
        <section className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Rewards
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              Get at least three positions correct to win the value of your
              placed coins as bonus reward!
            </li>
            <li>
              Strategic betting is key - place higher value coins on positions
              you are most confident about.
            </li>
            <li>
              Be honest in your self-assessment - this helps both your
              performance and our research.
            </li>
          </ul>
        </section>
        {/* Tips Section
        <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h2 className="text-lg font-semibold text-yellow-800 mb-3">
            Tips for Success
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Focus intently during the memorization phase</li>
            <li>Take your time placing icons - accuracy matters!</li>
            <li>Be strategic with your confidence bets</li>
            <li>Trust your memory but be realistic about your confidence</li>
          </ul>
        </section> */}
      </div>

      <div className="text-center">
        <button
          onClick={onStartStudy}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
        >
          Start Game
          <ChevronsRight className="ml-2 h-5 w-5" />
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Estimated study completion time: 10 minutes
        </p>
      </div>
    </Container>
  );
};

export default LandingPage;
