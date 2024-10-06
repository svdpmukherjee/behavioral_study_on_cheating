import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const AptitudeTest = () => {
  const [page, setPage] = useState('instructions');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [mouseData, setMouseData] = useState([]);
  const [tabFocused, setTabFocused] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabFocused(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const submissionData = {
        answer,
        mouseData,
        tabFocus: tabFocused,
        timeLeft
      };
      console.log("Submitting data:", submissionData);
      const response = await axios.post('http://localhost:8000/api/submit', submissionData);
      console.log("Response:", response.data);
      setPage('thank-you');
    } catch (error) {
      console.error('Error submitting answer:', error.response?.data || error.message);
    }
  }, [answer, mouseData, tabFocused, timeLeft]);

  useEffect(() => {
    if (page === 'question') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [page, handleSubmit]);

  const handleMouseMove = (e) => {
    setMouseData((prevData) => [...prevData, { x: e.clientX, y: e.clientY, time: Date.now() }]);
  };

  const handleStartTest = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/question');
      setQuestion(response.data.question);
      setPage('question');
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const renderInstructions = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Aptitude Test Instructions</h1>
      <p className="mb-6 text-gray-700">You will have 2 minutes to answer the question. Good luck!</p>
      <button 
        onClick={handleStartTest}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Start Test
      </button>
    </div>
  );

  const renderQuestion = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md" onMouseMove={handleMouseMove}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Question:</h2>
      <p className="mb-4 pb-5 text-gray-700">{question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer here"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
      />
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Time left: <span className="font-bold text-red-500">{timeLeft}</span> seconds</p>
        <button 
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  );

  const renderThankYou = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Thank you for taking the test!</h2>
      <p className="text-gray-700">We will contact you if you are eligible for another test in the near future.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {page === 'instructions' && renderInstructions()}
      {page === 'question' && renderQuestion()}
      {page === 'thank-you' && renderThankYou()}
    </div>
  );
};

export default AptitudeTest;