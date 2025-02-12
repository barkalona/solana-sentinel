import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Buffer } from 'buffer';

// Add required globals for Solana Web3.js
Object.assign(window, { Buffer, global: window });

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);