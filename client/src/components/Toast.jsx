import React from 'react';
import { useApp } from '../context/AppContext';

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            ×
          </button>
          {toast.duration > 0 && (
            <div
              className="toast-progress"
              style={{
                animation: `progressShrink ${toast.duration}ms linear forwards`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
