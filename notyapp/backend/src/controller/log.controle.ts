import type { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationServices.js';

export const getLogs = (req: Request, res: Response) => {
    
    const history = NotificationService.getHistory();
    res.json(history);
};