import ReactDOM from 'react-dom';
import React from 'react';

import App from './App';

import './services/firebase';

// import './styles/global.scss';
// import './styles/global.ts'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);