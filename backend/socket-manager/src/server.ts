import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import client from "prom-client";

import { chatRoutes } from './routes/chat';
import { configRoutes } from './routes/config';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  }
});

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
// io.use(authMiddleware);

io.on('connection', (socket: Socket) => {
    console.log('🔌 New client connected',socket.id);

    configRoutes(socket,io);
    chatRoutes(socket,io);

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected',socket.id);
    });
});

console.log("CORS allowed for",process.env.FRONTEND_URL)
console.log("Node ENV",process.env.NODE_ENV)

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL as string)
  .then(()=>{
    console.log("Connected to MongoDB Successfully.")
  })
  .catch((e)=>{
    console.log("Error connecting to MongoDB.")
    console.log(e)
  })

server.listen(5001,"0.0.0.0", () => {
  console.log(`Socket.IO running on port ${PORT}`);
});
