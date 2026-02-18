import type { Request, Response } from 'express'; 
import { NotificationService } from '../services/NotificationServices.js';

const notificationService = new NotificationService();

export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { type, templateKey, lang, to, data } = req.body;
        const result = await notificationService.send(type, templateKey, lang, to, data);
        
        res.json({ 
            success: true, 
            data: result 
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const getStats = (req: Request, res: Response) => {
    try {
        const stats = NotificationService.getStats();
        
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};