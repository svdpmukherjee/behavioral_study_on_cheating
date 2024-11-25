import React from "react";
import { Info } from "lucide-react";

const TheoryDisplay = ({ theory }) => {
  if (!theory) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
        <p className="text-lg text-blue-700">{theory.text}</p>
      </div>
    </div>
  );
};

export default TheoryDisplay;
