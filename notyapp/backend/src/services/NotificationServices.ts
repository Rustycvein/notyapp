import { EmailStrategy } from '../strategies/EmailStrategy.js';
import { SMSStrategy } from '../strategies/SmsStrategy.js';
import { PushStrategy } from '../strategies/PushStrategy.js';
import { type INotificationStrategy, type INotificationPayload } from '../interfaces/INotificationStrategy.js';
import esTemplates from '../templates/es.json' with { type: 'json' };
import enTemplates from '../templates/en.json' with { type: 'json' };

export class NotificationService {
    private strategies: Record<string, INotificationStrategy>;
    private templates: any;
    public static logs: any[] = [];
    private MAX_RETRIES = 3;

    constructor() {
        this.strategies = {
            email: new EmailStrategy(),
            sms: new SMSStrategy(),
            push: new PushStrategy()
        };
        this.templates = { es: esTemplates, en: enTemplates };
    }

    async send(type: 'email' | 'sms' | 'push', templateKey: string, lang: 'es' | 'en', to: string, data: any) {
        const strategy = this.strategies[type];
        if (!strategy) throw new Error("Strategy not found");

        const template = this.templates[lang][templateKey];
        if (!template) throw new Error("Template not found");

        let body = template.body;
        if (data) {
            Object.keys(data).forEach(key => {
                const value = data[key] !== undefined ? data[key] : "";
                body = body.split(`{{${key}}}`).join(value);
            });
        }

        const payload: INotificationPayload = {
            to,
            subject: template.subject,
            body
        };

        let attempts = 0;
        let success = false;
        let lastError = "";

        while (attempts < this.MAX_RETRIES && !success) {
            try {
                attempts++;
                await strategy.send(payload);
                success = true;
                
                const status = attempts > 1 ? 'Retried' : 'Sent';
                this.saveLog(type, payload, status, templateKey, attempts);
                return { success: true, attempts };
            } catch (error: any) {
                lastError = error.message;
                console.log(`Intento ${attempts} fallido para ${type}. Reintentando...`);
                if (attempts === this.MAX_RETRIES) {
                    this.saveLog(type, payload, 'Failed', templateKey, attempts);
                }
            }
        }

        throw new Error(`Fallo tras ${this.MAX_RETRIES} intentos: ${lastError}`);
    }

    private saveLog(channel: string, payload: INotificationPayload, status: string, templateKey: string, attempts: number) {
        const newLog = {
            id: Date.now(),
            date: new Date().toISOString(),
            channel: channel.toUpperCase(),
            type: templateKey,
            recipient: payload.to,
            status: status,
            attempts: attempts
        };
        
        NotificationService.logs.unshift(newLog);

        console.log(`\n--- [NotyApp Log Actualizado] ---`);
        console.table([newLog]);
    }

    public static getHistory() {
        return this.logs;
    }

    public static getStats() {
        return {
            total: this.logs.length,
            sent: this.logs.filter(l => l.status === 'Sent' || l.status === 'Retried').length,
            failed: this.logs.filter(l => l.status === 'Failed').length,
            channels: {
                email: this.logs.filter(l => l.channel === 'EMAIL').length,
                sms: this.logs.filter(l => l.channel === 'SMS').length,
                push: this.logs.filter(l => l.channel === 'PUSH').length
            }
        };
    }
}