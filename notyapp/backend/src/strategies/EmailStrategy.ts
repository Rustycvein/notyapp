import { Resend } from 'resend';
import type { 
    INotificationStrategy, 
    INotificationPayload, 
    INotificationResponse 
} from '../interfaces/INotificationStrategy.js';

export class EmailStrategy implements INotificationStrategy {
    private resend: Resend;

    constructor() {
        if (!process.env.RESEND_API_KEY) {
            console.error("ERROR: Falta RESEND_API_KEY en las variables de entorno");
        }
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async send(payload: INotificationPayload): Promise<INotificationResponse> {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'onboarding@resend.dev',
                to: payload.to,
                subject: payload.subject,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2 style="color: #1a73e8;">${payload.subject}</h2>
                        <p>${payload.body}</p>
                    </div>
                `
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log(`[EmailStrategy] Éxito vía Resend. ID: ${data?.id}`);

            return {
                success: true,
                message: "Notificación enviada vía API de Resend.",
                provider: 'Resend-API'
            };
        } catch (error: any) {
            console.error("[EmailStrategy Error]:", error.message);
            throw new Error(`Fallo en el envío: ${error.message}`);
        }
    }
}