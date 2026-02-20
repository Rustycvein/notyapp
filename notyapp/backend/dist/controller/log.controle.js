import { NotificationService } from '../services/NotificationServices.js';
export const getLogs = (req, res) => {
    const history = NotificationService.getHistory();
    res.json(history);
};
//# sourceMappingURL=log.controle.js.map