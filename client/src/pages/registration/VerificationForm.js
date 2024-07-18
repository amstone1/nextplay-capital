import React, { useState } from 'react';

const VerificationForm = ({ onVerify, error }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(verificationCode);
  };

  return (
    <div>
      <h2>Verify Your Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-primary">Verify</button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default VerificationForm;
