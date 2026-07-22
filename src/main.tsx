import React from 'react';
import ReactDOM from 'react-dom/client';
import { CommandCenter } from './components/CommandCenter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CommandCenter />
  </React.StrictMode>,
);
