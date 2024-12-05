import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import LoginPage from "../App/Login"; 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <App/>
</React.StrictMode>
)
