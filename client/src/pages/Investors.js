import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Investors = () => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/api/investors`);
        setInvestors(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching investors:', err.response?.data?.message || err.message);
        setError('Failed to fetch investors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvestors();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Investors</h1>
      {loading ? (
        <p>Loading investors...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="row">
          {investors.map(investor => (
            <div key={investor._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{investor.name}</h5>
                  <p className="card-text">Total Investment: ${investor.totalInvestment.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Investors;