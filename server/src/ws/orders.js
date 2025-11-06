import { pool } from '../db/pool.js';

let ioRef;
export function attachWs(io) {
  ioRef = io;
  io.on('connection', (socket) => {
    socket.on('subscribeOrder', ({ orderId }) => {
      socket.join(orderId);
    });
  });
}
const progression = ['CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED'];
export async function emitStatusProgression(orderId) {
  for (let i = 0; i < progression.length; i++) {
    const status = progression[i];
    await pool.query('UPDATE orders SET status=$1 WHERE id=$2', [status, orderId]);
    ioRef.to(orderId).emit('orderStatus', { orderId, status });
    await new Promise(r => setTimeout(r, 1500));
  }
}
