import React, { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api'
import { ws } from '../services/ws'

export default function Checkout() {
  const { state } = useLocation()
  const cart = state?.cart || []
  const restaurantId = state?.restaurantId
  const total = useMemo(() => cart.reduce((s, i) => s + i.price_cents * i.qty, 0), [cart])

  const [clientSecret, setClientSecret] = useState(null)
  const [status, setStatus] = useState('INIT')

  useEffect(() => {
    api.post('/stripe/create-payment-intent', { amount_cents: total }).then(r => setClientSecret(r.data.clientSecret))
  }, [total])

  function place() {
    api.post('/orders', {
      restaurantId,
      customer: { name: 'Demo User', phone: '9999999999', address: 'Bandra West, Mumbai' },
      items: cart,
      paymentIntent: clientSecret
    }).then(r => {
      setStatus(r.data.status)
      ws.emit('subscribeOrder', { orderId: r.data.orderId })
      ws.on('orderStatus', payload => setStatus(payload.status))
    })
  }

  if (!cart.length) return <p>No items in cart.</p>
  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ₹ {(total/100).toFixed(2)}</p>
      <button disabled={!clientSecret} onClick={place}>Pay & Place Order</button>
      <p>Order Status: <b>{status}</b></p>
    </div>
  )
}
