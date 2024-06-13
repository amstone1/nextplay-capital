import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Investors from './pages/Investors';
import Contracts from './pages/Contracts';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        {token && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/contracts" element={<Contracts />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
