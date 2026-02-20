import 'dotenv/config';
import express, { type Application } from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';

const app: Application = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/notifications', notificationRoutes);

export default app;