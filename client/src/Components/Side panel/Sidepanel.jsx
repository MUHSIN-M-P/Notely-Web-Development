import React, { useEffect, useState } from "react";
import "./Sidepanel.css";
import { useLocation, useNavigate } from "react-router-dom";
import user from "../../Assets/user.png";
import logo from "../../Assets/icons8-notes-64.png";
import myNotes from "../../Assets/my-notes-new.png";
import reminder from "../../Assets/reminder.png";
import axios from "axios";
import bin from "../../Assets/bin.png";
import { Link } from "react-router-dom";

export const Sidepanel = (props) => {
  const [dropDown, setDropDown] = useState(false);
  const [username,setUsername] = useState('Account Name')
  const [location, setLocation] = useState("/home");
  const currentLocation = useLocation();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/home/account", {
          withCredentials: true,
        });
        setUsername(response.data.user.username);
      } catch (error) {
        console.error("Failed to fetch account details", error);
      }
    };
    fetchDetails();
    setLocation(currentLocation.pathname);
  }, [setLocation, currentLocation]);

  const toggleMenu = () => {
    setDropDown(!dropDown);
  };

  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", 
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); 
        
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }

    navigate("/login");
};
  const handleClick = () => {
    navigate("/home/account");
  };

  return (
    <div className={`side-panel ${props.isSidebarVisible ? 'active':'hidden'}`}>
      <div className="logo">
        <img src={logo} alt="" />
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/home">
          <h1>Notely</h1>
        </Link>
      </div>
      <div className="account">
        <div
          className={`profile ${
            location === "/home/account" ? "selected" : ""
          }`}
        >
          <img onClick={handleClick} src={user} alt="" className="avatar" />
          <p onClick={handleClick}>{username}</p>
          <img
            width="15"
            height="15"
            src="https://img.icons8.com/ios/100/expand-arrow--v2.png"
            alt="expand-arrow--v2"
            className={`drop-down ${dropDown ? "rotate" : ""}`}
            onClick={toggleMenu}
          />
        </div>
        <div className={`drop-down-menu ${dropDown ? "show" : ""}`}>
          <div>
            <img
              src="https://img.icons8.com/?size=20&id=7820&format=png&color=000000"
              alt=""
            />
            <p onClick={handleClick}>My Profile</p>
          </div>
          <div onClick={handleLogout}>
            <img
              src="https://img.icons8.com/?size=20&id=24338&format=png&color=000000"
              alt=""
            />
            <p>Logout</p>
          </div>
        </div>
      </div>
      <input type="search" name="search" placeholder="Search" id="" />
      <div className={`options ${dropDown ? "slide" : ""}`}>
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/home">
          <div className={`item ${location === "/home" ? "selected" : ""}`}>
            <img src={myNotes} alt="" />
            <p className="your-notes">Your Notes</p>
          </div>
        </Link>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="/home/reminders"
        >
          <div
            className={`item ${
              location === "/home/reminders" ? "selected" : ""
            }`}
          >
            <img src={reminder} alt="" />
            <p>Reminder</p>
          </div>
        </Link>
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/home/bin">
          <div className={`item ${location === "/home/bin" ? "selected" : ""}`}>
            <img src={bin} alt="" />
            <p>Bin</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
