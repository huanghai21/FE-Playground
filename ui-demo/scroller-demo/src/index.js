import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Demo from './Demo';
import VConsole from 'vconsole';

// 直接初始化
const vConsole = new VConsole();
console.log('vConsole 已加载');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Demo />
    {/* <App /> */}
  </React.StrictMode>
);
