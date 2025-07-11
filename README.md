# Spoty - Music Streaming Platform

Una aplicación de streaming de música inspirada en Spotify, construida con Next.js y Firebase.

## Características

- 🎵 **Biblioteca de música organizada** - Géneros → Artistas → Canciones
- 🔐 **Autenticación de usuarios** - Email/contraseña, Google y Facebook
- 👑 **Panel de administración** - Para usuarios con permisos especiales
- 🖼️ **Gestión de archivos** - Subida de imágenes y audio con Cloudinary
- 📊 **Analytics** - Seguimiento con Firebase Analytics
- 🎨 **Diseño moderno** - Interfaz inspirada en Spotify con Tailwind CSS

## Tecnologías utilizadas

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **Almacenamiento**: Cloudinary (imágenes y audio)
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast

## Configuración

### 1. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Email/Password, Google, Facebook)
3. Crea una base de datos Firestore
4. Habilita Analytics
5. Copia las credenciales del proyecto

**⚠️ IMPORTANTE**: Si ves errores de conexión a Firebase, sigue la guía completa: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**Para configurar autenticación social**: Ver [SOCIAL_AUTH_SETUP.md](./SOCIAL_AUTH_SETUP.md)

### 2. Configurar Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Ve a tu Dashboard y copia las credenciales
3. Crea un preset de upload "unsigned_upload":
   - Ve a Settings → Upload
   - Scroll hasta "Upload presets"
   - Click "Add upload preset"
   - Nombre: `unsigned_upload`
   - Signing Mode: "Unsigned"
   - Save

### 3. Variables de entorno

Copia el archivo `.env.local` y completa las variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret
```

### 4. Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## Estructura del proyecto

```text
src/
├── app/                 # App Router de Next.js
│   ├── auth/           # Páginas de autenticación
│   ├── admin/          # Panel de administración
│   ├── genre/          # Páginas de géneros
│   └── artist/         # Páginas de artistas
├── components/         # Componentes reutilizables
│   ├── cards/         # Tarjetas de UI
│   ├── layout/        # Componentes de layout
│   ├── songs/         # Componentes de canciones
│   ├── admin/         # Componentes de administración
│   └── ui/            # Componentes de UI básicos
├── contexts/          # React Contexts
├── lib/               # Configuraciones y utilidades
├── services/          # Servicios para APIs
└── types/             # Definiciones de TypeScript
```

## Uso

### Como usuario normal

1. **Registrarse/Iniciar sesión**: Crea una cuenta o inicia sesión
2. **Explorar géneros**: Navega por los diferentes géneros musicales
3. **Descubrir artistas**: Haz clic en un género para ver sus artistas
4. **Escuchar canciones**: Haz clic en un artista para ver y reproducir sus canciones

### Como administrador

Para convertir un usuario en administrador:

1. Ve a Firebase Console → Firestore
2. Encuentra el documento del usuario en la colección `users`
3. Cambia el campo `role` de `"user"` a `"admin"`

Como administrador puedes:

- **Gestionar géneros**: Crear, editar y eliminar géneros musicales
- **Gestionar artistas**: Agregar artistas a géneros específicos
- **Gestionar canciones**: Subir canciones con archivos de audio
- **Ver estadísticas**: Panel con métricas de la plataforma

## Características técnicas

### Autenticación

- Firebase Authentication con email/password
- Contexto React para manejo de estado de usuario
- Protección de rutas basada en roles

### Base de datos (Firestore)

Estructura de colecciones:

```text
users/          # Información de usuarios
├── role        # "user" | "admin"
├── email
├── displayName
└── createdAt

genres/         # Géneros musicales
├── name
├── imageUrl
├── description
└── createdAt

artists/        # Artistas
├── name
├── imageUrl
├── genreId     # Referencia al género
├── description
└── createdAt

songs/          # Canciones
├── title
├── audioUrl
├── artistId    # Referencia al artista
├── duration
└── createdAt
```

### Almacenamiento

- **Imágenes**: Subidas a Cloudinary con optimización automática
- **Audio**: Archivos MP3 almacenados en Cloudinary
- **URLs**: Todas las URLs son servidas desde Cloudinary

### Seguridad

- Validación de tipos con TypeScript
- Sanitización de inputs
- Autenticación requerida para todas las páginas
- Verificación de roles para funciones de administración

## Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
