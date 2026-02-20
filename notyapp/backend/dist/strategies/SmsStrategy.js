export class SMSStrategy {
    async send(payload) {
        console.log(`[SMSStrategy] Enviando SMS al número: ${payload.to}`);
        return {
            success: true,
            message: `SMS enviado exitosamente a ${payload.to}`,
            provider: 'Twilio-Mock'
        };
    }
}
//# sourceMappingURL=SmsStrategy.js.map