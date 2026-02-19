import nodemailer from 'nodemailer';
import type { 
    INotificationStrategy, 
    INotificationPayload, 
    INotificationResponse 
} from '../interfaces/INotificationStrategy.js';

export class EmailStrategy implements INotificationStrategy {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("ERROR: Falta EMAIL_USER o EMAIL_PASS en el archivo .env");
        }

        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            pool: true,
            family: 4,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            },
            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 30000
        } as any); 

        this.transporter.verify((error) => {
            if (error) {
                console.error('[EmailStrategy] SMTP verification failed:', error.message);
                this.transporter = null;
            } else {
                console.log('[EmailStrategy] SMTP transporter is ready');
            }
        });
    }

    async send(payload: INotificationPayload): Promise<INotificationResponse> {
        try {
            if (!this.transporter) {
                throw new Error("El transporte de correo no está disponible.");
            }

            await this.transporter.sendMail({
                from: `"NotyApp System" <${process.env.EMAIL_USER}>`,
                to: payload.to,
                subject: payload.subject,
                text: payload.body,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                        <h2 style="color: #1a73e8;">${payload.subject}</h2>
                        <p>${payload.body}</p>
                    </div>
                `
            });

            console.log(`[EmailStrategy] Correo enviado con éxito a: ${payload.to}`);

            return {
                success: true,
                message: "Notificación enviada exitosamente.",
                provider: 'Gmail-SMTP'
            };
        } catch (error: any) {
            console.error("[EmailStrategy Error]:", error.stack || error.message || error);
            throw new Error(`Fallo en el envío: ${error.message || error}`);
        }
    }
}