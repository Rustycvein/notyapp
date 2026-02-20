import type { INotificationPayload, INotificationResponse, INotificationStrategy } from '../interfaces/INotificationStrategy.js';
export declare class SMSStrategy implements INotificationStrategy {
    send(payload: INotificationPayload): Promise<INotificationResponse>;
}
//# sourceMappingURL=SmsStrategy.d.ts.map