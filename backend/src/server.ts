import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

io.on('connection', (socket: Socket) => {
  console.log('New client connected');

  socket.on('message', (data: any) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL as string)
  .then(()=>{
    console.log("Connected to MongoDB Successfully.")
  })
  .catch(()=>{
    console.log("Error connecting to MongoDB.")
  })

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
