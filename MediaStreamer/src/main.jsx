import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

if (!API_KEY) {
  console.warn(
    '%c⚠️ YouTube API key not found. Using demo data.',
    'background: #ff0000; color: white; padding: 4px; border-radius: 4px;'
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)