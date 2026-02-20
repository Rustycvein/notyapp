import 'dotenv/config';
import app from './app.js';
const PORT = process.env.PORT || 3000;
const startServer = () => {
    try {
        app.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`Servidor activo en puerto ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al iniciar:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map