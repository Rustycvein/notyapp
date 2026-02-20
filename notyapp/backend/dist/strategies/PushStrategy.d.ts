import type { INotificationStrategy, INotificationPayload, INotificationResponse } from '../interfaces/INotificationStrategy.js';
export declare class PushStrategy implements INotificationStrategy {
    constructor();
    send(payload: INotificationPayload): Promise<INotificationResponse>;
}
//# sourceMappingURL=PushStrategy.d.ts.map