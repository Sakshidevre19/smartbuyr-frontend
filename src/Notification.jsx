import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Notification;