import React, { useState, useEffect } from "react";
import { Sidepanel } from "../Side panel/Sidepanel";
import { Link } from "react-router-dom";
import logo from "../../Assets/icons8-notes-64.png";
import { Outlet } from "react-router-dom";
import "./RouteLayout.css";

export const RouteLayout = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Check screen width to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="route-layout">
      {isMobileView && (
        <header className="top-navbar">
          <div onClick={toggleSidebar} className={`ham-menu ${isSidebarVisible?'active':null}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="logo">
            <img src={logo} alt="" />
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/home"
            >
              <h1>Notely</h1>
            </Link>
          </div>
        </header>
      )}

      {/* Show sidebar based on screen size and visibility */}
      {(!isMobileView || isSidebarVisible) && <Sidepanel isSidebarVisible={isSidebarVisible} />}

      <main
        className={
          isSidebarVisible ? "main-content with-sidebar" : "main-content"
        }
      >
        <Outlet />
      </main>
    </div>
  );
};
