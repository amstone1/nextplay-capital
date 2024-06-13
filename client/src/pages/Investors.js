import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Investors = () => {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/api/investors`);
        setInvestors(res.data);
      } catch (err) {
        console.error('Error fetching investors:', err.response?.data?.message || err.message);
      }
    };
    fetchInvestors();
  }, []);

  return (
    <div>
      <h1>Investors</h1>
      <ul>
        {investors.map(investor => (
          <li key={investor._id}>
            <p>Name: {investor.name}</p>
            <p>Total Investment: ${investor.totalInvestment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Investors;
