import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Restaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => { api.get(`/restaurants/${id}/menu`).then(r => setMenu(r.data)) }, [id])

  function add(mi) {
    setCart(prev => {
      const found = prev.find(p => p.menuItemId === mi.id)
      if (found) return prev.map(p => p.menuItemId === mi.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, { menuItemId: mi.id, name: mi.name, qty: 1, price_cents: mi.price_cents }]
    })
  }

  const total = cart.reduce((s, i) => s + i.price_cents * i.qty, 0)

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h2>Menu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 12 }}>
        {menu.map(mi => (
          <div key={mi.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
            <img src={mi.image_url || '/images/food/default.jpg'} alt={mi.name} style={{ width: '100%', borderRadius: 12 }} />
            <h3>{mi.name}</h3>
            <p>₹ {(mi.price_cents/100).toFixed(2)}</p>
            <button onClick={() => add(mi)}>Add</button>
          </div>
        ))}
      </div>
      <div style={{ position: 'sticky', bottom: 12, background: '#fff', padding: 12, border: '1px solid #ddd', borderRadius: 12, marginTop: 12 }}>
        <b>Cart:</b> {cart.map(i => `${i.name} x${i.qty}`).join(', ') || 'Empty'} · <b>Total:</b> ₹ {(total/100).toFixed(2)}
        <button disabled={!cart.length} onClick={() => navigate('/checkout', { state: { cart, restaurantId: parseInt(id, 10) } })} style={{ marginLeft: 12 }}>Checkout</button>
      </div>
    </div>
  )
}
