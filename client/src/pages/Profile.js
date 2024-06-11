import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/athletes/profile', {
          headers: { 'x-auth-token': token }
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Sport: {profile.sport}</p>
      <p>Funding Goal: ${profile.fundingGoal}</p>
      <p>Earnings Percentage: {profile.earningsPercentage}%</p>
      <p>Duration: {profile.duration} months</p>
    </div>
  );
};

export default Profile;
