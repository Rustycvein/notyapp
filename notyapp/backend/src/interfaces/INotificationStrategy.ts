export interface INotificationPayload {
    to: string;
    subject: string;
    body: string;
}

export interface INotificationResponse {
    success: boolean;
    message: string;
    provider: string;
}

export interface INotificationStrategy {
    send(payload: INotificationPayload): Promise<INotificationResponse>;
}