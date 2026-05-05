import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Dashboard from './components/Dashboard.jsx'
import api from './utils/api.js'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated on load
    checkAuth()
  }, [])

const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/me', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    } catch {
      navigate('/')
    }
  }

  const logout = async () => {
    await api.get('/api/auth/logout')
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard logout={logout} user={user} />} />
      </Routes>
    </div>
  )
}

export default App
