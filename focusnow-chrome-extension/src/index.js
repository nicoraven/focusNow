import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Clock from './clock';
import Settings from './settings';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <div className="pageWrapper">
        <Settings />
        <Clock />
        <App />
    </div>,
    document.getElementById('root'));
registerServiceWorker();