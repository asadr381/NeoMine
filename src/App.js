// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import './Logo.css';  // Import the new Logo CSS
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import logo from './logo.png';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Login from './Login';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const App = () => {
  const [user, setUser] = useState(null);
  const [minedTokens, setMinedTokens] = useState(0);
  const [totalSupply, setTotalSupply] = useState(99999999999);
  const [supplyHistory, setSupplyHistory] = useState([99999999999]);

  const [boosted, setBoosted] = useState(false);
  const [boostDuration, setBoostDuration] = useState(0);

  const fetchTotalSupply = async () => {
    const totalSupplyDoc = doc(db, 'global', 'totalSupply');
    const totalSupplyData = await getDoc(totalSupplyDoc);
    if (totalSupplyData.exists()) {
      const currentSupply = totalSupplyData.data().supply;
      setTotalSupply(currentSupply);
      setSupplyHistory((prev) => [...prev, currentSupply]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserData(user.uid);
        fetchTotalSupply();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    const userDoc = doc(db, 'users', uid);
    const userData = await getDoc(userDoc);
    if (userData.exists()) {
      const minedTokens = userData.data().minedTokens;
      setMinedTokens(typeof minedTokens === 'number' ? minedTokens : 0);
    } else {
      setMinedTokens(0);
    }
  };

  const mineTokens = async () => {
    if (totalSupply > 0) {
      const tokenMultiplier = boosted ? 2 : 1;
      const newTokens = minedTokens + tokenMultiplier;
      setMinedTokens(newTokens);

      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { minedTokens: newTokens }, { merge: true });

      const newTotalSupply = totalSupply - tokenMultiplier;
      setTotalSupply(newTotalSupply);
      setSupplyHistory((prev) => [...prev, newTotalSupply]);

      const totalSupplyDoc = doc(db, 'global', 'totalSupply');
      await setDoc(totalSupplyDoc, { supply: newTotalSupply }, { merge: true });
    }
  };

  const activateBoost = () => {
    setBoosted(true);
    setBoostDuration(300);

    setTimeout(() => {
      setBoosted(false);
      setBoostDuration(0);
    }, 300 * 1000);
  };

  useEffect(() => {
    let interval;
    if (boosted && boostDuration > 0) {
      interval = setInterval(() => {
        setBoostDuration((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [boosted, boostDuration]);

  const handleLogout = () => signOut(auth);

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  const chartData = {
    labels: supplyHistory.map((_, index) => `Step ${index + 1}`),
    datasets: [
      {
        label: 'Total Supply Over Time',
        data: supplyHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="welcome">
          <h1>Welcome, {user.displayName}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="supply">
          <h2>Total Supply: {totalSupply}</h2>
        </div>
        <div className="logo-container">




        <img src={logo} alt="Logo" className="logo" />
       <h4>NEOMINE</h4>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="main-content">
        <h3>Your Mined Tokens: {minedTokens}</h3>

        {totalSupply > 0 ? (
          <button onClick={mineTokens}>
            Mine Token {boosted ? '(Boosted)' : '' }
          </button>
        ) : (
          <p>No more tokens to mine!</p>
        )}
        <h6>Click to Mine the Coins</h6>
        <div>
          <button onClick={activateBoost} disabled={boosted}>
            Activate Boost (5 minutes)
          </button>
          {boosted && (
            <p>
              Boost active! Time remaining: {Math.floor(boostDuration / 60)}:
              {boostDuration % 60 < 10 ? '0' + boostDuration % 60 : boostDuration % 60}
            </p>
          )}
        </div>
        <h6>Boost the Mine</h6>
      </div>
    </div>
  );
};

export default App;
