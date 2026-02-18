import nodemailer from 'nodemailer';
import type { 
    INotificationStrategy, 
    INotificationPayload, 
    INotificationResponse 
} from '../interfaces/INotificationStrategy.js';

export class EmailStrategy implements INotificationStrategy {
    private transporter: nodemailer.Transporter;

    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("ERROR: Falta EMAIL_USER o EMAIL_PASS en el archivo .env");
        }

        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            pool: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000
        });
    }

    async send(payload: INotificationPayload): Promise<INotificationResponse> {
        try {
            if (!this.transporter) {
                throw new Error("El transporte de correo no ha sido inicializado correctamente.");
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
                message: "Notificación enviada exitosamente a la bandeja de entrada real.",
                provider: 'Gmail-SMTP'
            };
        } catch (error: any) {
            console.error("[EmailStrategy Error]:", error.message);
            throw new Error(`Fallo en el envío de correo real: ${error.message}`);
        }
    }
}