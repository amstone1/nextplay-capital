import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const res = await axios.get('http://localhost:5000/api/contracts');
      setContracts(res.data);
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
