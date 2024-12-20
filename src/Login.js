import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="animated-bg"></div>
      <div className="login-content">
        <h1>Login with Google</h1>
        <button onClick={handleLogin} disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
