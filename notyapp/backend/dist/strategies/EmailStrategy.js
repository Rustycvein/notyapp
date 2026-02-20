import nodemailer from 'nodemailer';
export class EmailStrategy {
    transporter = null;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            family: 4
        });
        this.transporter.verify((error) => {
            if (error) {
                console.error('[EmailStrategy] SMTP error:', error.message);
                //this.transporter = null;
            }
            else {
                console.log('[EmailStrategy] Gmail SMTP listo en Railway');
            }
        });
    }
    async send(payload) {
        try {
            if (!this.transporter) {
                throw new Error("El transporte de correo no está disponible.");
            }
            await this.transporter.sendMail({
                from: `"NotyApp" <${process.env.EMAIL_USER}>`,
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
            return {
                success: true,
                message: "Notificación enviada exitosamente.",
                provider: 'Gmail-Railway'
            };
        }
        catch (error) {
            console.error("[EmailStrategy Error]:", error.message);
            throw new Error(`Fallo en el envío: ${error.message}`);
        }
    }
}
//# sourceMappingURL=EmailStrategy.js.map