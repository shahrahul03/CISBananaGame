import React, { useState } from "react";
import { validateLoginForm, validateRegistrationForm } from "./validation";
import { useNavigate } from "react-router-dom";
import Popup from "./popupComponent";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerContactNumber, setRegisterContactNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [activeForm, setActiveForm] = useState("login");
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Switch between login and register forms
  const switchToForm = (formName) => {
    setActiveForm(formName);
    setErrors({});
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        dispatch(login({ token, role: user.role }));
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", user.role);
        navigate("/game");
        setPopupMessage("User logged in successfully");
      } else {
        setErrors({ email: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ email: "An error occurred. Please try again." });
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegistrationForm(
      registerEmail,
      registerPassword,
      registerName,
      registerAddress,
      registerContactNumber
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          address: registerAddress,
          contact: registerContactNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPopupMessage("User registered successfully");
        setTimeout(() => {
          setPopupMessage("");
          switchToForm("login");
        }, 1000);
      } else {
        setErrors({ registerEmail: data.message || "Registration failed." });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ registerEmail: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-green-200">
      <div className="w-full md:w-1/2 p-8">
        <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg p-6">
          {activeForm === "login" && (
            <form onSubmit={handleLogin}>
              <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Login
              </button>
              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchToForm("register")}
                  className="text-green-600 hover:underline"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {activeForm === "register" && (
            <form onSubmit={handleRegister}>
              <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="registerEmail"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                  required
                />
                {errors.registerEmail && (
                  <p className="text-red-500 text-sm">{errors.registerEmail}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="registerPassword"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="registerPassword"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={registerAddress}
                  onChange={(e) => setRegisterAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your address"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  value={registerContactNumber}
                  onChange={(e) => setRegisterContactNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your contact number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Register
              </button>
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchToForm("login")}
                  className="text-green-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
        {popupMessage && (
          <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
        )}
      </div>
    </div>
  );
};

export default Login;
