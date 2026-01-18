import React from 'react';

const LoginPrompt = ({ isOpen, onClose, onSignIn, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content login-prompt">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="login-prompt-content">
          <h2>Sign in to continue</h2>
          <p>Please sign in to add items to your cart or wishlist</p>
          <div className="login-prompt-buttons">
            <button className="btn btn-primary" onClick={onSignIn}>
              Sign In
            </button>
            <button className="btn btn-secondary" onClick={onSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;