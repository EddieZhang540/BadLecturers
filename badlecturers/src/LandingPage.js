import './LandingPage.css';
import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import { UserContext, UserProvider } from './contexts/UserProvider';
import NavBar from './Components/NavBar';
import Course from './Components/Course';
import CourseList from './Components/CourseList';
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config()

// sample course
const math135 =
{
  "name": "MATH 135",
  "id": "math135"
}

function LandingPage() {
  useEffect(() => {
    const options = {
      method: 'GET',
      url: "https://openapi.data.uwaterloo.ca/v3/Terms/current",
      headers: {
        "x-api-key": process.env.REACT_APP_UW_KEY
      }
    }

    axios.request(options).then(result => {
      console.log(result);
    })
  }, [])


  return (
    <UserProvider>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course course={math135} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </UserProvider>

  );
}

function Home() {
  const user = useContext(UserContext);
  return (
    <div>
      {user === null ? <SignUp /> : <CourseList />}
    </div>
  );
}

export default LandingPage;
