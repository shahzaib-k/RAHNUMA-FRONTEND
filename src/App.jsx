import { useEffect, useState } from 'react';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import Cookies from 'js-cookie';
import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react"
import Dashboard from '../Pages/Dashboard';
import Assessments from '../Pages/Assesments';
import ResumeBuilder from '../Pages/Resume-builder';
import Profile from '../Pages/Profile';
import ForgotPassword from '../Pages/ForgotPassword';
import ResetPassword from '../Pages/ResetPassword';
import AptitudeTest from '../Pages/AptitudeTest';
import PersonalityTest from '../Pages/PersonalityTest';
import AtsChecker from '../Pages/AtsChecker';
import ResumeEditor from '../Pages/ResumeEditor';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const res = await fetch('/auth/check', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.valid) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setIsAuthenticated(true);
          } else {
            Cookies.remove('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token check failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    };
    checkToken();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] flex items-center justify-center">
        <Loader className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div data-theme="dark" >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
          <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" /> : <ResetPassword />} />

          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/assessments" element={isAuthenticated ? <Assessments /> : <Navigate to="/login" />} />
          <Route path="/resume-builder" element={isAuthenticated ? <ResumeBuilder /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/assessments/aptitude-test" element={isAuthenticated ? <AptitudeTest /> : <Navigate to="/login" />} />
          <Route path="/assessments/personality-test" element={isAuthenticated ? <PersonalityTest /> : <Navigate to="/login" />} />
          <Route path="/ats-checker" element={isAuthenticated ? <AtsChecker /> : <Navigate to="/login" />} />
          <Route path="/resume-editor" element={isAuthenticated ? <ResumeEditor /> : <Navigate to="/login" />} />

        </Routes>
      </div>
    </>
  )
}

export default App
