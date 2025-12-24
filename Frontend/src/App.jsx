import { Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import { Home } from './components/Home.jsx'
import Transaction from './components/Transaction.jsx'
import Budget from './components/Budget.jsx'
import Analytics from './components/Analytics.jsx'
import Profile from './components/Profile.jsx'

function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  )
}

export default App
