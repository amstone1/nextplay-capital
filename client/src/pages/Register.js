import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState(''); // New state for user type
  const [athleteInfo, setAthleteInfo] = useState({
    sport: '',
    fundingGoal: '',
    earningsOption: 'percentage', // New state for earnings option
    earningsPercentage: '',
    durationYears: '',
    firstXPercentage: '',
    firstYDollars: '',
    contractActivation: ''
  }); // New state for athlete info
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sports = ['Basketball', 'Football', 'Baseball', 'Soccer', 'Tennis', 'Golf', 'Hockey'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userType === 'athlete' && athleteInfo.fundingGoal > 1000000) {
      setError('Funding goal cannot exceed $1,000,000');
      return;
    }
    if (userType === 'athlete' && athleteInfo.earningsOption === 'percentage' && athleteInfo.earningsPercentage > 20) {
      setError('Committed percentage of earnings cannot exceed 20%');
      return;
    }
    if (userType === 'athlete' && athleteInfo.earningsOption === 'fixed' && (athleteInfo.firstXPercentage > 50 || athleteInfo.firstYDollars <= athleteInfo.fundingGoal * 1.25)) {
      setError('First percentage cannot exceed 50% and the return must be at least 25% more than the funding goal');
      return;
    }
    if (userType === 'athlete' && athleteInfo.durationYears > 8) {
      setError('Duration cannot exceed 8 years');
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const payload = { email, password, username, userType };
      if (userType === 'athlete') {
        payload.athleteInfo = athleteInfo;
      }
      const res = await axios.post(`${apiUrl}/api/auth/register`, payload);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setError(null); // Clear any previous errors
      setSuccess('Registration successful. You can now log in.');
    } catch (err) {
      console.error('Registration error:', err.response || err.message); // Detailed log
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleAthleteInfoChange = (e) => {
    setAthleteInfo({
      ...athleteInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label>User Type:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="">Select User Type</option>
            <option value="athlete">Athlete</option>
            <option value="investor">Investor</option>
          </select>
        </div>
        {userType === 'athlete' && (
          <div>
            <h3>Athlete Information</h3>
            <div>
              <label>Sport:</label>
              <select name="sport" value={athleteInfo.sport} onChange={handleAthleteInfoChange}>
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Funding Goal:</label>
              <input
                type="number"
                name="fundingGoal"
                value={athleteInfo.fundingGoal}
                onChange={handleAthleteInfoChange}
                max="1000000"
                title="This is the US dollar amount that I am seeking to raise from investors"
              />
            </div>
            <div>
              <label>Committed Earnings Option:</label>
              <select
                name="earningsOption"
                value={athleteInfo.earningsOption}
                onChange={(e) =>
                  setAthleteInfo({ ...athleteInfo, earningsOption: e.target.value })
                }
              >
                <option value="percentage">Percentage of Earnings</option>
                <option value="fixed">First X Percentage of Y Dollars</option>
              </select>
            </div>
            {athleteInfo.earningsOption === 'percentage' && (
              <>
                <div>
                  <label>Committed Percentage of Earnings:</label>
                  <input
                    type="number"
                    name="earningsPercentage"
                    value={athleteInfo.earningsPercentage}
                    onChange={handleAthleteInfoChange}
                    max="20"
                    title="This is the percentage of my earnings I am offering in exchange for funding. In the next field, I will determine how long I am willing to commit that percentage of my earnings to investors. Keep in mind that the more of my earnings you are willing to give up, and the longer the duration, the more you are giving up of your own earnings (but conversely, the more attractive this may be to potential investors)."
                  />
                </div>
                <div>
                  <label>Duration (years):</label>
                  <input
                    type="number"
                    name="durationYears"
                    value={athleteInfo.durationYears}
                    onChange={handleAthleteInfoChange}
                    max="8"
                  />
                </div>
              </>
            )}
            {athleteInfo.earningsOption === 'fixed' && (
              <>
                <div>
                  <label>First X Percentage:</label>
                  <input
                    type="number"
                    name="firstXPercentage"
                    value={athleteInfo.firstXPercentage}
                    onChange={handleAthleteInfoChange}
                    max="50"
                    title="This is the percentage of your first earnings you are offering. It should be between 1% and 50%."
                  />
                </div>
                <div>
                  <label>Of My First Y Dollars:</label>
                  <input
                    type="number"
                    name="firstYDollars"
                    value={athleteInfo.firstYDollars}
                    onChange={handleAthleteInfoChange}
                    title="The return must be at least 25% more than the funding goal."
                  />
                </div>
              </>
            )}
            <div>
              <label>Contract Activation Amount:</label>
              <input
                type="number"
                name="contractActivation"
                value={athleteInfo.contractActivation}
                onChange={handleAthleteInfoChange}
                max="100"
                min="1"
              />
            </div>
          </div>
        )}
        <button type="submit">Register</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </form>
    </div>
  );
};

export default Register;
