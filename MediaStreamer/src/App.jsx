// App.jsx
import './App.css'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import History from './pages/History'
import SearchHistory from './pages/SearchHistory' // Import SearchHistory
import Layout from './components/Layout'
import { HistoryProvider } from './context/HistoryContext'
import { NotificationProvider } from './context/NotificationContext'
import { SearchHistoryProvider } from './context/SearchHistoryContext' // Import
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <NotificationProvider>
      <HistoryProvider>
        <SearchHistoryProvider> {/* Add SearchHistoryProvider */}
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<History />} />
              <Route path="/search-history" element={<SearchHistory />} /> {/* Add route */}
            </Routes>
          </Layout>
        </SearchHistoryProvider>
      </HistoryProvider>
    </NotificationProvider>
  )
}

export default App