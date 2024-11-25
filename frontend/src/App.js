import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ConsentPage from "./components/ConsentPage";
import ProlificIdPage from "./components/ProlificIdPage";
import TestPage from "./components/TestPage";
import ThankYouPage from "./components/ThankYouPage";
import Container from "./components/Container";

const App = () => {
  // Navigation state
  const [page, setPage] = useState("landing");

  // Participant data
  const [prolificId, setProlificId] = useState("");
  const [startTime] = useState(new Date().toISOString());
  const [endTime, setEndTime] = useState(null);

  // URL parameter handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const PROLIFIC_PID = params.get("PROLIFIC_PID");
    if (PROLIFIC_PID) {
      setProlificId(PROLIFIC_PID);
    }
  }, []);

  // Prevent browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
      alert("Please use the buttons provided to navigate through the study.");
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Navigation handlers
  const handleStartStudy = () => {
    setPage("consent");
  };

  const handleConsent = () => {
    setPage("prolificId");
  };

  const handleProlificIdSubmit = (id) => {
    setProlificId(id);
    setPage("test");
  };

  const handleTestComplete = () => {
    setEndTime(new Date().toISOString());
    setPage("thankYou");
  };

  // Progress calculation
  const getProgress = () => {
    const progressMap = {
      landing: 0,
      consent: 25,
      prolificId: 50,
      test: 75,
      thankYou: 100,
    };
    return progressMap[page];
  };

  // Page content renderer
  const renderPage = () => {
    switch (page) {
      case "landing":
        return <LandingPage onStartStudy={handleStartStudy} />;

      case "consent":
        return <ConsentPage onConsent={handleConsent} />;

      case "prolificId":
        return (
          <ProlificIdPage
            onSubmit={handleProlificIdSubmit}
            initialValue={prolificId} // In case it came from URL
          />
        );

      case "test":
        return (
          <TestPage
            prolificId={prolificId}
            startTime={startTime}
            onComplete={handleTestComplete}
          />
        );

      case "thankYou":
        return (
          <ThankYouPage
            prolificId={prolificId}
            startTime={startTime}
            endTime={endTime}
          />
        );

      default:
        return (
          <div className="text-center text-red-600">
            <h2 className="text-xl font-bold">Error</h2>
            <p>An unexpected error occurred. Please refresh the page.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {/* Main content */}
      <div className="p-4">
        <Container>
          {/* Study header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {page === "thankYou" ? "" : "Game to Test Your Memory"}
            </h1>
            {prolificId && page !== "thankYou" && (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-4">
                  <div className="space-y-2">
                    <p>Participant ID: {prolificId}</p>
                    <p>
                      Session started:{" "}
                      {new Date(startTime).toLocaleTimeString()}
                    </p>
                    {page === "thankYou" && endTime && (
                      <p>
                        Session completed:{" "}
                        {new Date(endTime).toLocaleTimeString()}
                      </p>
                    )}
                    {page === "thankYou" && (
                      <p>
                        Total duration:{" "}
                        {Math.round(
                          (new Date(endTime) - new Date(startTime)) / 60000
                        )}{" "}
                        minutes
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-2"></div>
              </div>
            )}
          </div>

          {/* Page content */}
          {renderPage()}

          {/* Study footer */}
          {/* <div className="mt-8 text-center text-sm text-gray-500">
            <p>University of Luxembourg</p>
            {startTime && page !== "landing" && (
              <p className="mt-1">
                Session started: {new Date(startTime).toLocaleTimeString()}
              </p>
            )}
          </div> */}
        </Container>
      </div>

      {/* Exit confirmation */}
      {page !== "thankYou" && (
        <div style={{ display: "none" }}>
          {/* This div helps trigger browser's exit confirmation */}
          <form>
            <input type="text" />
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
