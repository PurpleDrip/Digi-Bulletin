import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import client from "prom-client";

import userRouter from './routes/userRouter';
import serverRouter from './routes/serverRouter';
import reportRouter from './routes/reportRouter';
import authRouter from './routes/authRouter';
import messageRouter from './routes/messageRouter';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://15.207.20.226:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const routePath = req.route?.path || req.path;
    httpRequestCounter.labels(req.method, routePath, res.statusCode.toString()).inc();
    end({ method: req.method, route: routePath, status: res.statusCode });
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/server", serverRouter);
app.use("/api/report", reportRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;

console.log("CORS allowed for", process.env.FRONTEND_URL);

mongoose.connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to MongoDB Successfully.");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB.");
    console.log(e);
  });

app.listen(5000, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
