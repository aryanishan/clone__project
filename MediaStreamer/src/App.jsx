import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Profile from './pages/Profile'
import { HistoryProvider } from './context/HistoryContext'
import { SearchHistoryProvider } from './context/SearchHistoryContext'
import './App.css'

function App() {
  return (
    <HistoryProvider>
      <SearchHistoryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </SearchHistoryProvider>
    </HistoryProvider>
  )
}

export default App