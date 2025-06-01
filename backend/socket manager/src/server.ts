import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"
import { authMiddleware } from './middlewares/authenticate';
import { joinServer } from './controllers/server';
import { chatRoutes } from './routes/chat';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true,
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

// io.use(authMiddleware);

io.on('connection', (socket: Socket) => {
    console.log('🔌 New client connected',socket.id);

    chatRoutes(socket,io);

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected',socket.id);
    });
});

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL as string)
  .then(()=>{
    console.log("Connected to MongoDB Successfully.")
  })
  .catch((e)=>{
    console.log("Error connecting to MongoDB.")
    console.log(e)
  })

server.listen(PORT, () => {
  console.log(`Socket running on port ${PORT}`);
});
