import "./App.css";
import { Homepage } from "./Components/Homepage/Homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Components/Login/Login";
import { Signup } from "./Components/Signup/Signup";
import { Createnote } from "./Components/Create note/Createnote";
import { RouteLayout } from "./Components/RoutLayout/RouteLayout";
import { Account } from "./Components/Account/Account";
import { Reminder } from "./Components/Reminder/Reminder";
import { Bin } from "./Components/Bin/Bin";
import { useEffect, useState } from "react";
import PrivateRoute from "./Components/Homepage/PrivateRoute";
import { Editnote } from "./Components/Edit Notes/Editnotes";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/auth/check-session", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();
          setIsUserLoggedIn(data.isLoggedIn);
        } catch (error) {
          console.error("Failed to check session:", error);
          setIsUserLoggedIn(false);
        }
      } else {
        setIsUserLoggedIn(false);
      }
      setLoading(false); 
    };

    checkUserLoginStatus();
  }, []);

  if (loading) {
    return (<div className="loading-container">
      <div className="loader"></div>
  </div>)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Redirect to /home if the user is logged in, else to /login */}
          <Route 
            path="/" 
            element={isUserLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} 
          />
          
          {/* Public routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsUserLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsUserLoggedIn} />} />

          {/* Private routes that require authentication */}
          <Route
            path="/home"
            element={
              <PrivateRoute element={<RouteLayout />} isAuthenticated={isUserLoggedIn} />
            }
          >
            <Route index element={<Homepage />} />
            <Route path="create-note" element={<Createnote />} />
            <Route path="account" element={<Account />} />
            <Route path="reminders" element={<Reminder />} />
            <Route path="bin" element={<Bin />} />
            <Route path="edit" element={<Editnote/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
