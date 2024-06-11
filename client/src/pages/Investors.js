import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Investors = () => {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      const res = await axios.get('http://localhost:5000/api/investors');
      setInvestors(res.data);
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
