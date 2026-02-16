import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const isAbortError = (error) => {
  if (!error) return false;
  return (
    error?.name === 'AbortError' ||
    error?.name === 'DOMException' ||
    error?.message?.includes('The operation was aborted')
  );
};

window.addEventListener('unhandledrejection', (event) => {
  if (isAbortError(event.reason)) {
    console.warn('Ignored abort error:', event.reason);
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
