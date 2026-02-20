import { NotificationService } from '../services/NotificationServices.js';
const notificationService = new NotificationService();
export const sendNotification = async (req, res) => {
    try {
        const { type, templateKey, lang, to, data } = req.body;
        const result = await notificationService.send(type, templateKey, lang, to, data);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
export const getStats = (req, res) => {
    try {
        const stats = NotificationService.getStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
//# sourceMappingURL=notification.controller.js.map