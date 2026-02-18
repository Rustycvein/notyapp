import type{
     INotificationPayload,
     INotificationResponse,
     INotificationStrategy
} from '../interfaces/INotificationStrategy.js';

export class SMSStrategy implements INotificationStrategy{
    async send(payload: INotificationPayload): Promise<INotificationResponse> {
        console.log(`[SMSStrategy] Enviando SMS al número: ${payload.to}`);
        return {
            success: true,
            message: `SMS enviado exitosamente a ${payload.to}`,
            provider: 'Twilio-Mock'
        };
    }
}