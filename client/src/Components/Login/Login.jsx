import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

import "./Login.css";

export const Login = ({setIsAuthenticated}) => {
  const [checkbox, setCheckbox] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const navigate = useNavigate();
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckbox = (e) => {
    setCheckbox(e.target.checked);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
  
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: checkbox, 
        }
      );
      
      const { token } = response.data;
      console.log(token)
      if (response.data.message === "Login successful") {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate("/home");
        console.log("Login successful");
      } else {
        setDisplayMessage(response.data.message);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  

  return (
    <div className="login">
      <div className="login-window">
        <div className="logo-login">
          <img src="icons8-notes-64.png" alt="" />
          <h1>Notely</h1>
        </div>
        <h2>Sign In</h2>
        <p>Login to stay connected</p>
        <input type="email" placeholder="Email" name="" id="email" />
        <input
          type={showPassword ? "text" : "password"}
          value={password || ''}
          onChange={handlePasswordChange}
          placeholder="Password"
          name=""
          id="password"
        />
        <div className="option-container">
          <div>
            <label>
              <input
                onChange={handleCheckbox}
                type="checkbox"
                checked={checkbox}
                id="remember"
              />
              Remember Me
            </label>
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={togglePasswordVisibility}
              />
              Show Password
            </label>
          </div>
          <p id="backend-message">{displayMessage}</p>
          <a href="#forgot">Forgot Password?</a>
        </div>
        <button onClick={handleSubmit}>Sign In</button>
        <p className="sign-text">
          Create an Account <span>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to="/signup"
              >
                Sign Up
              </Link>
            </span>
        </p>
      </div>
    </div>
  );
};
