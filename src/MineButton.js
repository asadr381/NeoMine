import React from 'react';
import './App.css'; // Import the CSS file to use the styles

const MineButton = ({ onClick, isLoading, isDisabled }) => {
    return (
      <button 
        onClick={onClick} 
        disabled={isDisabled} 
        className={isLoading ? 'loading' : ''}
      >
        {isLoading ? 'Mining...' : 'Mine Token'}
      </button>
    );
  };
  

export default MineButton;
