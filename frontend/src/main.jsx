import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'
import axios from "axios";
import { API_BASE_URL } from "./services/api";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL.replace(/\/api$/, "");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <SpeedInsights /> 
  </StrictMode>,
)
