import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"

import userRouter from './routes/userRouter';
import serverRouter from './routes/serverRouter';
import messageRouter from './routes/messageRouter';
import reportRouter from './routes/reportRouter';
import authRouter from './routes/authRouter';
import { registerSocketHandlers } from './handlers/socketHandlers';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter);
app.use("/api/server",serverRouter);
app.use("/api/msg",messageRouter);
app.use("/api/report",reportRouter);

io.on('connection', (socket: Socket) => {
  console.log('🔌 New client connected',socket.id);

  registerSocketHandlers(socket,io)

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected',socket.id);
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL as string)
  .then(()=>{
    console.log("Connected to MongoDB Successfully.")
  })
  .catch((e)=>{
    console.log("Error connecting to MongoDB.")
    console.log(e)
  })

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
