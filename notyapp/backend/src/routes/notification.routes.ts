import { Router } from 'express';
import { sendNotification, getStats } from '../controller/notification.controller.js';
import { NotificationService } from '../services/NotificationServices.js';

const router = Router();
const notificationService = new NotificationService();

router.post('/send', async (req, res) => {
    try {
        const { type, templateKey, lang, to, data } = req.body;
        const result = await notificationService.send(type, templateKey, lang, to, data);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.get('/logs', (req, res) => {
    const history = NotificationService.getHistory();
    res.status(200).json(history);
});

router.get('/stats', getStats);


export default router;