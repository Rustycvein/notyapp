import 'dotenv/config';
import express, { type Application } from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

export default app;