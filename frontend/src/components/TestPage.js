import React, { useState, useEffect } from "react";
import MemoryGame from "./MemoryGame";
import Container from "./Container";
import { AlertTriangle } from "lucide-react";

const TestPage = ({ prolificId, onComplete }) => {
  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [startTime] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionLost, setConnectionLost] = useState(false);

  // Initialize session on component mount
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/initialize-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prolificId,
              startTime,
              metadata: {
                userAgent: navigator.userAgent,
                screenSize: {
                  width: window.innerWidth,
                  height: window.innerHeight,
                },
                language: navigator.language,
                platform: navigator.platform,
                timestamp: new Date().toISOString(),
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to initialize session");
        }

        const data = await response.json();

        if (mounted) {
          setSessionId(data.sessionId);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (mounted) {
          setError(
            "Failed to initialize the experiment. Please refresh the page and try again."
          );
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    // Check connection status
    const pingServer = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8000/api/ping");
        setConnectionLost(!response.ok);
      } catch (error) {
        setConnectionLost(true);
      }
    }, 30000); // Check every 30 seconds

    return () => {
      mounted = false;
      clearInterval(pingServer);
    };
  }, [prolificId, startTime]);

  // Handle game completion
  const handleGameComplete = async () => {
    try {
      const completionTime = new Date().toISOString();
      const totalDuration = new Date() - new Date(startTime);

      await fetch("http://localhost:8000/api/complete-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          prolificId,
          sessionData: {
            startTime,
            completionTime,
            totalDuration,
            completionStatus: "success",
          },
        }),
      });

      onComplete();
    } catch (error) {
      console.error("Session completion error:", error);
      // Log error but still allow completion
      try {
        await fetch("http://localhost:8000/api/log-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            prolificId,
            error: "Completion logging failed",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (_) {
        // Silently fail if error logging fails
      }
      onComplete();
    }
  };

  // Handle early termination
  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      event.returnValue = "";

      try {
        await fetch("http://localhost:8000/api/terminate-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            prolificId,
            terminationTime: new Date().toISOString(),
            reason: "page_close",
          }),
        });
      } catch (error) {
        console.error("Session termination logging failed:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId, prolificId]);

  // Loading state
  if (isLoading) {
    return (
      <Container>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing experiment...</p>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Connection warning */}
        {connectionLost && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">
                Connection lost. Please check your internet connection.
              </p>
            </div>
          </div>
        )}

        {/* Session info */}
        {/* <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
          <p>Participant ID: {prolificId}</p>
          <p>Session started: {new Date(startTime).toLocaleTimeString()}</p>
        </div>
        <div className="p-2"></div> */}

        {/* Memory Game */}
        <MemoryGame
          prolificId={prolificId}
          sessionId={sessionId}
          onComplete={handleGameComplete}
        />

        {/* Help text */}
        {/* <div className="text-center text-sm text-gray-500">
          <p>
            Having technical issues? Contact{" "}
            <a
              href="mailto:researcher@uni.lu"
              className="text-blue-500 hover:text-blue-600"
            >
              suvadeep.mukherjee@uni.lu
            </a>
          </p>
        </div> */}
      </div>
    </Container>
  );
};

export default TestPage;
