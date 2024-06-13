import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/api/contracts`);
        setContracts(res.data);
      } catch (err) {
        console.error('Error fetching contracts:', err.response?.data?.message || err.message);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div>
      <h1>Contracts</h1>
      <ul>
        {contracts.map(contract => (
          <li key={contract._id}>
            <p>Athlete: {contract.athlete.name}</p>
            <p>Investor: {contract.investor.name}</p>
            <p>Amount: ${contract.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contracts;
