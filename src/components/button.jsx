import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button 
      type={type} 
      onClick={onClick}
      className={`btn btn-primary ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;