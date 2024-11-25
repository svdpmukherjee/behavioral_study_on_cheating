import React, { useState } from "react";
import Container from "./Container";

const ProlificIdPage = ({ onSubmit }) => {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(id);
  };

  return (
    // <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <Container>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Prolific ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter your Prolific ID"
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Start Test
        </button>
      </form>
    </Container>
    // </div>
  );
};

export default ProlificIdPage;
