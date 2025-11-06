import React, { Suspense, lazy } from 'react'
import { Link, Routes, Route } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home.jsx'))
const Restaurant = lazy(() => import('./pages/Restaurant.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>FoodHub</h1>
        <nav><Link to="/">Home</Link></nav>
      </header>
      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/r/:id" element={<Restaurant />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Suspense>
    </div>
  )
}
