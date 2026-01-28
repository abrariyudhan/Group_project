if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express');
const { createServer } = require('http')
const { Server } = require('socket.io')
const app = express();
const PORT = 3000;
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

app.use(cors())

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User masuk ke spesifik project
  socket.on('joinProject', (projectId) => {
    socket.join(`project-${projectId}`)
    console.log(`User joined project: ${projectId}`)
  })

  // Saat ada update status task
  socket.on('updateTask', (payload) => {
    // Kirim ke semua orang di project yang sama KECUALI pengirim
    socket.to(`project-${payload.projectId}`).emit('taskUpdated', payload)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(router)
app.use(errorHandler)

httpServer.listen(3000, () => {
  console.log('Server & Socket running on port 3000');
})