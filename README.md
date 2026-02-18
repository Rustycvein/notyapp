SISTEMA DE NOTIFICACIONES MULTICANAL (EMAIL/SMS/PUSH)

DESCRIPCIÓN
Este proyecto es una API de backend robusta diseñada para gestionar el envío de notificaciones a través de múltiples canales. El objetivo principal es centralizar y estandarizar la comunicación con el cliente (OTP, alertas, marketing, recibos) bajo una arquitectura profesional que garantiza la trazabilidad y la resiliencia del sistema.

La solución implementa una lógica de reintentos automáticos y una gestión estricta de estados de envío, asegurando que los fallos temporales en los proveedores externos no afecten la experiencia del usuario final ni la integridad de los datos de negocio.

TECNOLOGÍAS UTILIZADAS
- TypeScript: Lenguaje principal para asegurar la integridad de los datos y facilitar el mantenimiento.
- Node.js & Express.js: Entorno de ejecución y framework para la construcción de la API REST.
- HTML/CSS: Para el diseño y estructura de las plantillas de correo electrónico.
- Render/Railway: Para el despliegue en un entorno de producción (Hosteo).

LIBRERÍAS Y DEPENDENCIAS
El proyecto utiliza las siguientes dependencias clave:
- express: Creación y manejo de las rutas del servidor.
- cors: Manejo de políticas de intercambio de recursos de origen cruzado.
- nodemailer / resend: Integración para el envío de correos electrónicos reales.
- dotenv: Gestión segura de variables de entorno y claves de API.
- handlebars / mustache: Motor de renderizado para plantillas con inyección de variables dinámicas.

CARACTERÍSTICAS PRINCIPALES
- Provider Strategy Pattern: Arquitectura que permite alternar dinámicamente entre proveedores reales y Mocks (como Twilio-Mock para SMS) sin modificar el core del sistema.
- Multi-idioma (I18n): Soporte nativo para plantillas localizadas en Español (ES) e Inglés (EN).
- Sistema de Reintentos: Lógica de recuperación ante fallos que reintenta el envío hasta 3 veces antes de marcar una notificación como fallida.
- Trazabilidad de Estados: Registro detallado del ciclo de vida de la notificación (Pending, Sent, Retried, Failed).

ESTADOS DE ENVÍO
1. Pending: Notificación recibida y registrada, en espera de ser procesada por el proveedor.
2. Sent: Confirmación exitosa de entrega por parte del servicio externo.
3. Retried: Intento fallido detectado; el sistema está ejecutando una nueva tentativa de envío.
4. Failed: Agotamiento de intentos permitidos o error crítico del proveedor.

INSTALACIÓN
Para ejecutar el proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
   git clone <url-del-repositorio>

2. Instala las dependencias:
   npm install

3. Configura el entorno:
   Crea un archivo .env en la raíz del proyecto y añade las credenciales correspondientes (API Keys de proveedores, puerto, etc.).

4. Inicia el servidor:
   npm start

