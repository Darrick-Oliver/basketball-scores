import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './reload.js'

ReactDOM.render(
  <React.StrictMode>
    <App />
    <script src="reload.js"></script>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
