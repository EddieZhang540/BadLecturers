import './LandingPage.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Components/Home';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import { UserProvider } from './contexts/UserProvider';



function LandingPage() {
  let navigate = useNavigate();
  function handleClick() {
    navigate("/login");
  }
  return (
    <UserProvider>
      <div className="App">
        <div>TODO: Nav bar</div>
        <button onClick={handleClick}>LOGIN SCREEN</button>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </UserProvider>

  );
}

export default LandingPage;
