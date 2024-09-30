import React from "react";
import "./Signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Signup = ({setIsAuthenticated}) => {
  const [password, setPassword] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const fName = document.querySelector("#fName").value;
    const lName = document.querySelector("#lName").value;
    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
        { fName, lName, email, password },
        { withCredentials: true }
      );
      const message = response.data;
      setIsAuthenticated(true)
      if (message === "Signup successful") {
        navigate("/home");
        
              console.log("Signup successful");
      } else {
        setDisplayMessage(message);
      }
      
    } catch (error) {
      console.error("Sign up failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="logo-container">
          <img src="icons8-notes-64.png" alt="NotePlus Logo" />
          <h1>NotePlus</h1>
        </div>
        <h2>Sign Up</h2>
        <p>Create your account.</p>
        <form>
          <div className="name-fields">
            <input type="text" placeholder="First Name" id="fName" required />
            <input type="text" placeholder="Last Name" id="lName" required />
          </div>
          <input type="email" placeholder="Email" id="email" required />
          <div className="password-fields">
            <input
              type={showPassword ? "text" : "password"}
              value={password || ""}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
              id="password"
            />
          </div>
          <div className="terms">
            <label htmlFor="terms">
              <input type="checkbox" id="terms" required />I agree with the
              terms of use
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
          <button onClick={handleSubmit} type="submit" className="btn">
            Sign Up
          </button>
          <p className="sign-text">
            Already have an account?
            <span>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to="/login"
              >
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
