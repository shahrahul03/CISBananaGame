import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from "./Components/Register";
import Login from "./Components/Login";
import Game from "./Components/Game";
import ProtectedRoute from "./protectedRoutes/protectedRoutes";
import UserProfile from "./Components/userProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to /login */}
        <Route exact path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/game" element={<Game />} /> */}
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
