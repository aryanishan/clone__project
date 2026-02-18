// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Check if API key is present
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY
console.log('Environment check:', {
  hasApiKey: !!apiKey,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD
})

if (!apiKey) {
  console.warn(
    '⚠️ YouTube API key not found. Using fallback videos.\n' +
    'Please add VITE_YOUTUBE_API_KEY to your .env file'
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)