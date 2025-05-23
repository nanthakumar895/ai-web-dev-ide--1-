
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Apply dark mode by default, can be made configurable later
document.documentElement.classList.add('dark');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
