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
    origin: "http://15.207.20.226:3000",
    credentials: true,
  }
});

// Prometheus default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5]
});

const socketConnections = new client.Gauge({
  name: 'socket_connections',
  help: 'Number of active socket.io connections'
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const routePath = req.route?.path || req.path;
    httpRequestCounter.labels(req.method, routePath, res.statusCode.toString()).inc();
    end({ method: req.method, route: routePath, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Socket.IO connection tracking
io.on('connection', (socket: Socket) => {
  console.log('🔌 New client connected', socket.id);
  socketConnections.inc();

  configRoutes(socket, io);
  chatRoutes(socket, io);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected', socket.id);
    socketConnections.dec();
  });
});

console.log("CORS allowed for", process.env.FRONTEND_URL);
console.log("Node ENV", process.env.NODE_ENV);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB Successfully.");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB.");
    console.log(e);
  });

server.listen(5001, "0.0.0.0", () => {
  console.log(`Socket.IO running on port ${PORT}`);
});
