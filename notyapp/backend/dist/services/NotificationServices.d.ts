export declare class NotificationService {
    private strategies;
    private templates;
    static logs: any[];
    private MAX_RETRIES;
    constructor();
    send(type: 'email' | 'sms' | 'push', templateKey: string, lang: 'es' | 'en', to: string, data: any): Promise<{
        success: boolean;
        attempts: number;
    }>;
    private saveLog;
    static getHistory(): any[];
    static getStats(): {
        total: number;
        sent: number;
        failed: number;
        channels: {
            email: number;
            sms: number;
            push: number;
        };
    };
}
//# sourceMappingURL=NotificationServices.d.ts.map