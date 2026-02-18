// App.jsx
import './App.css'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import History from './pages/History' // Import History page
import Layout from './components/Layout'
import { HistoryProvider } from './context/HistoryContext' // Import HistoryProvider
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <HistoryProvider> {/* Wrap with HistoryProvider */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} /> {/* Add History route */}
        </Routes>
      </Layout>
    </HistoryProvider>
  )
}

export default App