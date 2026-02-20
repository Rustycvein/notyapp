import { Resend } from "resend";
export class EmailStrategy {
    resend;
    constructor() {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY no está definida.");
        }
        this.resend = new Resend(process.env.RESEND_API_KEY);
        console.log("[EmailStrategy] Resend inicializado 🚀");
    }
    async send(payload) {
        try {
            const { error } = await this.resend.emails.send({
                from: "NotyApp <onboarding@resend.dev>", // temporal para pruebas
                to: payload.to,
                subject: payload.subject,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>${payload.subject}</h2>
                        <p>${payload.body}</p>
                    </div>
                `
            });
            if (error) {
                throw new Error(error.message);
            }
            return {
                success: true,
                message: "Notificación enviada con Resend.",
                provider: "Resend"
            };
        }
        catch (error) {
            console.error("[EmailStrategy Error]:", error.message);
            throw new Error(`Fallo en el envío: ${error.message}`);
        }
    }
}
//# sourceMappingURL=EmailStrategy.js.map