
import './App.css';
import React, {useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import DashboardView from './Components/Dashboard/DashboardView.js';
import Login from './Components/Login/Login.js';



function App() {
  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/authen/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <>
      <ToastContainer />
      <Router>
        <div className="container">
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
          
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <DashboardView setAuth={setAuth} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
