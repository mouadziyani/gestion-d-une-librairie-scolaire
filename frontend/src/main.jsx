import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights /> 
  </StrictMode>,
)
