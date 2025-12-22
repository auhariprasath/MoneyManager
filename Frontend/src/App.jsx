import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import { Home } from './components/Home.jsx'
import Transaction from './components/Transaction.jsx'
import Budget from './components/Budget.jsx'
import Analytics from './components/Analytics.jsx'

function App() {

  return (
    <>
      <Routes>
        <p>huygrtc</p>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  )
}

export default App
