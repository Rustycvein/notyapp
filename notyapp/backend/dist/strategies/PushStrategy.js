import admin from 'firebase-admin';
export class PushStrategy {
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
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('[PushStrategy] Firebase Admin SDK inicializado correctamente.');
            }
            catch (error) {
                console.error('[PushStrategy] Error crítico de inicialización:', error.message);
            }
        }
    }
    async send(payload) {
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
        }
        catch (error) {
            console.error('[PushStrategy] Error en el envío:', error);
            return {
                success: false,
                message: `Error de Firebase: ${error.message}`,
                provider: 'Firebase Cloud Messaging'
            };
        }
    }
}
//# sourceMappingURL=PushStrategy.js.map