import './App.css'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App
