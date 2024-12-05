import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import axios from "axios";

function Game() {
  const [score, setScore] = useState(
    parseInt(localStorage.getItem("score")) || 0
  );
  const dispatch = useDispatch();
  const [steps, setSteps] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [lives, setLives] = useState(5);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/bananagame-1.0-SNAPSHOT/api/game"
      );
      const data = await response.json();
      setGameData(data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching game data:", error);
      setMessage("Error fetching game data.");
    }
  };

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      setError("No token found, please login.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: ` ${token}` },
        });
        setProfile(response.data.profile); // Set profile data
      } catch (err) {
        setError(err.response?.data?.msg || "Error fetching profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleAnswer = async () => {
    const selectedNumber = parseInt(userInput);
    if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 9) {
      setMessage("Please enter a valid number between 0 and 9.");
      return;
    }

    setSteps((prev) => prev + 1);
    setClickedNumbers((prev) => [...prev, selectedNumber]);

    if (selectedNumber === gameData.solution) {
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem("score", newScore);
      setMessage(`Correct! You answered in ${steps + 1} steps.`);
      setGameOver(true);

      // Save the score after the game ends
      if (profile && profile.user.name) {
        try {
          const username = profile.user.name;
          await axios.post("http://localhost:5000/api/game/save", {
            username,
            score: newScore, // Use newScore directly
          });
          // console.log("Score saved successfully!");
        } catch (error) {
          // console.error("Error saving game score:", error);
        }
      } else {
        setMessage("Error: Username not found, unable to save score.");
      }
    } else {
      setLives((prev) => prev - 1);
      if (lives - 1 === 0) {
        setMessage("Game over! You've run out of lives.");
        setGameOver(true);
      } else {
        setMessage("Wrong answer. Try again!");
      }
    }

    setUserInput("");
  };

  const playAgain = async () => {
    setSteps(0);
    setGameOver(false);
    setMessage("");
    setUserInput("");
    setClickedNumbers([]);
    setLives(5);
    fetchGame();

    // Optionally save the score when restarting
    if (profile && profile.user.name) {
      const username = profile.user.name;
      try {
        await axios.post("http://localhost:5000/api/game/save", {
          username,
          score, // Ensure current state value is used
        });
        console.log("Score saved before restarting!");
      } catch (error) {
        console.error("Error saving game score:", error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.removeItem("score");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Image Section */}
      {gameData && (
        <div className="lg:w-1/2 w-full p-3 rounded-lg bg-gray-300 h-1/2 lg:h-full flex items-center justify-center">
          <img
            src={`data:image/png;base64,${gameData.imageBase64}`}
            alt="Banana game puzzle"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Game Controls Section */}
      <div className="lg:w-1/2 w-full h-full flex flex-col items-center p-6 bg-white shadow-xl overflow-y-auto relative">
        {profile && (
          <>
            {/* Profile Image */}
            <div
              className="absolute top-1 right-3 flex items-center cursor-pointer "
              onClick={toggleDropdown}
            >
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-14 h-14 rounded-full shadow-md"
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-14 right-3 bg-white shadow-lg rounded-lg w-40">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}

        <div className="w-full px-4 mb-4 mt-11 flex justify-between">
          <h2 className="text-xl font-bold text-yellow-600">Score: {score}</h2>
          <h2 className="text-xl font-bold text-yellow-600">Lives: {lives}</h2>
        </div>

        {message && (
          <div className="text-center mb-4 p-2 bg-green-600 font-mono text-white rounded-lg shadow-md">
            <p>{message}</p>
          </div>
        )}

        {!gameOver && (
          <div className="mb-4 w-full flex flex-col items-center">
            <input
              type="number"
              value={userInput}
              onChange={handleInputChange}
              className="p-3 rounded-lg border-2 border-green-500 mb-4 text-center w-full"
              placeholder="Enter number"
              min="0"
              max="9"
            />
            <button
              onClick={handleAnswer}
              className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-800 transition duration-300"
            >
              Submit Answer
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center mb-6">
            <p className="text-lg text-green-600 mb-4">
              {lives > 0 ? (
                <>You answered correctly in {steps} steps!</>
              ) : (
                <>Game Over! The correct answer was {gameData.solution}.</>
              )}
            </p>
            <button
              onClick={playAgain}
              className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-800 transition duration-300"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-center">
            Numbers You Clicked:
          </h2>
          <div className="flex justify-center mt-2 flex-wrap">
            {clickedNumbers.length > 0 ? (
              clickedNumbers.map((num, index) => (
                <span
                  key={index}
                  className="text-yellow-600 p-2 text-2xl mx-2 mb-2"
                >
                  {num}
                </span>
              ))
            ) : (
              <p>No numbers clicked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
