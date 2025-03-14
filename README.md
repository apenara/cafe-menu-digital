# Menú Digital para Cafetería

Una aplicación web moderna para gestionar el menú digital de una cafetería, construida con Next.js y Firebase.

## Características

- 🌐 Soporte multilingüe (Español/Inglés)
- 📱 Diseño responsivo para dispositivos móviles
- 👤 Panel de administración protegido
- 🎨 Interfaz moderna y atractiva
- 🔥 Base de datos en tiempo real con Firebase
- 📸 Soporte para imágenes de productos
- 📱 PWA (Progressive Web App)

## Tecnologías

- Next.js 14
- Firebase
- TypeScript
- Chakra UI
- next-intl para internacionalización

## Requisitos

- Node.js 18.0 o superior
- Cuenta de Firebase
- npm o yarn

## Configuración

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/apenara/cafe-menu-digital.git
cd cafe-menu-digital
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Crear archivo .env.local y configurar variables de Firebase:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

4. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## Estructura del Proyecto

- `/src/app` - Rutas y páginas de la aplicación
- `/src/components` - Componentes reutilizables
- `/src/lib` - Utilidades y configuración de Firebase
- `/src/hooks` - Custom hooks
- `/public/locales` - Archivos de traducción
- `/src/types` - Definiciones de TypeScript

## Licencia

MIT