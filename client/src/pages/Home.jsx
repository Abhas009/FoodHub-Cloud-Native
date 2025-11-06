import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  useEffect(() => { api.get('/restaurants').then(r => setRestaurants(r.data)) }, [])
  return (
    <div>
      <h2>Top Restaurants</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 12 }}>
        {restaurants.map(r => (
          <Link key={r.id} to={`/r/${r.id}`} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12, textDecoration: 'none', color: 'inherit' }}>
            <img src={r.image_url || '/images/food/default.jpg'} alt={r.name} style={{ width: '100%', borderRadius: 12 }} />
            <h3>{r.name}</h3>
            <p>{r.cuisine} · ⭐ {r.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
