import sgMail from "@sendgrid/mail";
export class EmailStrategy {
    constructor() {
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY no está definida.");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async send(payload) {
        try {
            const msg = {
                to: payload.to,
                from: "proyectosalterna92@gmail.com",
                subject: payload.subject,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>${payload.subject}</h2>
                        <p>${payload.body}</p>
                    </div>
                `
            };
            await sgMail.send(msg);
            return {
                success: true,
                message: "Notificación enviada con SendGrid.",
                provider: "SendGrid"
            };
        }
        catch (error) {
            throw new Error("Fallo en el envío con SendGrid.");
        }
    }
}
//# sourceMappingURL=EmailStrategy.js.map