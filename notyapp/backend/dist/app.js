import 'dotenv/config';
import express, {} from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';
const app = express();
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
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
export default app;
//
//# sourceMappingURL=app.js.map