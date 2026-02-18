import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Profile from './pages/Profile'
import { HistoryProvider } from './context/HistoryContext'
import { SearchHistoryProvider } from './context/SearchHistoryContext'
import { NotificationProvider } from './context/NotificationContext' // ✅ ADD THIS
import './App.css'

function App() {
  return (
    <HistoryProvider>
      <SearchHistoryProvider>
        <NotificationProvider> {/* ✅ ADD THIS WRAPPER */}
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </SearchHistoryProvider>
    </HistoryProvider>
  )
}

export default App