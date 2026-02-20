import type { INotificationStrategy, INotificationPayload, INotificationResponse } from '../interfaces/INotificationStrategy.js';
export declare class EmailStrategy implements INotificationStrategy {
    private transporter;
    constructor();
    send(payload: INotificationPayload): Promise<INotificationResponse>;
}
//# sourceMappingURL=EmailStrategy.d.ts.map