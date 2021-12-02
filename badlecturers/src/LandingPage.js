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
import { TermProvider } from './contexts/TermProvider';
import PostPage from './Components/PostPage';
dotenv.config()


function LandingPage() {

  return (
    <TermProvider>
      <UserProvider>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="" element={<HomePicker />} />
            <Route path="/:courseId" element={<Course />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path=":courseId/p/:postId" element ={<PostPage />} />
          </Routes>
        </div>
      </UserProvider>
    </TermProvider>


  );
}

function HomePicker() {
  const user = useContext(UserContext);
  return (
    <div>
      {user === null ? <SignUp /> : <CourseList />}
    </div>
  );
}

function CoursePicker() {
  
}


export default LandingPage;
