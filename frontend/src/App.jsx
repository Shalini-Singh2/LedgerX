import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000'; 

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // FIX: html ki jagah hum direct 'body' tag par theme lagayenge
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;