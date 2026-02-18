import admin from 'firebase-admin';
import type { 
    INotificationStrategy, 
    INotificationPayload, 
    INotificationResponse 
} from '../interfaces/INotificationStrategy.js';

export class PushStrategy implements INotificationStrategy {
    constructor() {
        if (!admin.apps.length) {
            try {
                // 1. Obtenemos el string del .env
                const envConfig = process.env.FIREBASE_SERVICE_ACCOUNT;
                
                if (!envConfig) {
                    throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT no está definida');
                }

                const serviceAccount = JSON.parse(envConfig);

                if (serviceAccount.private_key) {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
                });

                console.log('[PushStrategy] Firebase Admin SDK inicializado correctamente.');
            } catch (error: any) {
                console.error('[PushStrategy] Error crítico de inicialización:', error.message);
            }
        }
    }

    async send(payload: INotificationPayload): Promise<INotificationResponse> {
        const message = {
            notification: {
                title: 'NotyApp Notification',
                body: payload.body || 'Tienes un nuevo mensaje'
            },
            token: payload.to 
        };

        try {
            const response = await admin.messaging().send(message);
            
            return {
                success: true,
                message: `Notificación Push enviada con ID: ${response}`,
                provider: 'Firebase Cloud Messaging'
            };
        } catch (error: any) {
            console.error('[PushStrategy] Error en el envío:', error);
            return {
                success: false,
                message: `Error de Firebase: ${error.message}`,
                provider: 'Firebase Cloud Messaging'
            };
        }
    }
}