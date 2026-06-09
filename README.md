# Diagnóstico Empresarial · Wadil AI Studio

Aplicación web tipo chat que evalúa la madurez empresarial mediante 15 preguntas y genera un diagnóstico personalizado con recomendaciones.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS v4 |
| Animaciones | Motion (Framer Motion) |
| Íconos | Lucide React |
| Backend | PHP 8.x |
| Librería email | PHPMailer |
| SMTP | SMTP.com |
| Base de datos | Firebase Firestore |
| Servidor | Apache (cPanel) |

## Funcionalidades

- **Assessment interactivo**: 15 preguntas con 4 opciones cada una (0-3 pts, max 45)
- **6 niveles de madurez**: desde *Empresa Desorientada* hasta *Empresa Escalable*
- **Feedback detallado**: fortalezas, riesgos, oportunidades y recomendaciones
- **Captación de leads**: formulario para agendar sesión ejecutiva
- **Notificaciones por email**: envío automático de resultados del diagnóstico
- **Persistencia en Firestore**: almacenamiento de sesiones y respuestas

## Arquitectura

```
Usuario → Apache → index.html (React SPA)
                    ├── /assets/ (JS + CSS)
                    └── /send-email.php (envío de correos vía PHPMailer + SMTP.com)

Firebase Firestore ← JS del navegador (lectura/escritura directa)
```

El frontend React se compila con Vite a archivos estáticos. Apache sirve el SPA con un `.htaccess` para routing. El envío de correos se realiza mediante `send-email.php` usando PHPMailer con SMTP.com (puerto 80) y fallback a `mail()` local.

## Despliegue en LAMP

```bash
# 1. Compilar frontend
npm run build

# 2. Copiar PHP
cp public/send-email.php dist/

# 3. Subir dist/ al servidor (DocumentRoot de Apache)
scp -r dist/* usuario@servidor:/ruta/web/

# 4. Asegurar permisos
chmod -R 755 /ruta/web/assets/

# 5. Configurar .htaccess (incluido en dist/)
```

## Variables de entorno (opcional)

```env
SMTP_HOST=send.smtp.com
SMTP_USER=info@wadil.mx
SMTP_PASS=tu_password
SMTP_PORT=80
```

## Firebase

Las reglas de Firestore están en `firestore.rules`. Desplegar en:
https://console.firebase.google.com/project/gen-lang-client-0711695466/firestore/rules

## Desarrollado por

[Wadil AI Studio](https://wadil.mx) — Consultoría empresarial con inteligencia artificial.
