import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState(''); // Change state variable from roomCode to name
  const navigate = useNavigate(); // Initialize the navigate function

  const handleJoin = (e) => {
    e.preventDefault();

    if (!name) {
      return; // Prevent navigation if name is empty
    }

    // Navigate to the chat component with the name as a parameter
    navigate(`/chat`, { state: { name } }); // Pass name in navigation state
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Chat Room</h2>
        <form onSubmit={handleJoin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name} // Update value to name
            onChange={(e) => setName(e.target.value)} // Update handler to setName
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Join;
