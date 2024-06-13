import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [emailOrUsername, setEmailOrUsername] = useState(''); // Change to emailOrUsername
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${apiUrl}/api/auth/login`, { emailOrUsername, password }); // Change to emailOrUsername
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      console.log('Login successful, token:', res.data.token); // Debug log
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message); // Debug log
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username:</label> {/* Change the label */}
          <input
            type="text"
            value={emailOrUsername} // Change to emailOrUsername
            onChange={(e) => setEmailOrUsername(e.target.value)} // Change to emailOrUsername
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;
