import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LoggedInTest from './pages/LoggedInTest';

function App() {
  return (
    <Router> {/*This  wraps the entire app and makes it so we can use routing*/}
      <Routes> {/*This wraps all the routes and each <Route> component inside <Routes> defiines a path and a component that should be rendered when user visits that path*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element ={<LoggedInTest />}/> 
        <Route path="*" element={<Navigate to="/" />} /> {/*  *path is a wildcard any unknown / undefined route will match that star and route user back to homepage */}
      </Routes>
    </Router>
  );
}

export default App;
