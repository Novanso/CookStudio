import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
window.parent.document.title = 'CookStudio';
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);