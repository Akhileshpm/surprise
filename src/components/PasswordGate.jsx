import React, { useState } from 'react';
import { track } from '../analytics';
import '../styles/PasswordGate.css';

function PasswordGate({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd) => {
    const haspink = pwd.toLowerCase().includes('pink');
    const hasWhite = pwd.toLowerCase().includes('white');
    return haspink && hasWhite;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validatePassword(password);
    track('password_attempt', { success }, { immediate: true });
    if (success) {
      setError('');
      onAuthenticate();
    } else {
    //   setError('Password must contain both "pink" and "white"');
      setPassword('');
    }
  };

  return (
    <div className="password-gate">
      <div className="gate-container">
        <h1>🔐 Enter Your Password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="password-input"
            autoFocus
          />
          <button type="submit" className="submit-btn">
            Unlock
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default PasswordGate;
