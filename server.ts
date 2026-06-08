import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// API route for sending email
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, score, level, answers } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Missing phone number' });
  }

  const displayName = name && name.trim() ? name : 'No proporcionado';
  const displayEmail = email && email.trim() ? email : 'No proporcionado';

  // Configure transporter using SMTP variables from env
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'diagnostico@wadil.mx';

  // Format the answers as a clean list for HTML
  const answersListHtml = Array.isArray(answers) 
    ? answers.map((ans: any, idx: number) => `
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
          <p style="margin: 0; font-weight: bold; color: #1e293b;">${idx + 1}. ${ans.questionText}</p>
          <p style="margin: 5px 0 0 0; color: #475569;">Respuesta: <strong>${ans.answerLabel}</strong> (${ans.points} pts)</p>
        </div>
      `).join('')
    : '<p>No se registraron respuestas detalladas.</p>';

  // Format a text fallback
  const answersListText = Array.isArray(answers)
    ? answers.map((ans: any, idx: number) => `${idx + 1}. ${ans.questionText}\n   Respuesta: ${ans.answerLabel} (${ans.points} pts)`).join('\n\n')
    : 'No se registraron respuestas detalladas.';

  // Build the rich HTML representation of the email
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Solicitud de Diagnóstico - Wadil AI Studio</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Dark Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Nueva Solicitud de Sesión</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Diagnóstico de Madurez Empresarial</p>
        </div>
        
        <div style="padding: 30px;">
          <!-- Contact Info Section -->
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">1. Datos de Contacto</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 120px;">Nombre:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${displayName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Email:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">
                ${email && email.trim() ? `<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>` : 'No proporcionado'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Teléfono:</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 600;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #10b981; text-decoration: none; font-weight: bold;">${phone} 💬 (WhatsApp)</a></td>
            </tr>
          </table>

          <!-- Diagnostic Result Section -->
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0;">2. Resultado del Diagnóstico</h2>
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #475569; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Nivel Obtenido</p>
            <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 850; color: #0f172a;">${level}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;">Puntaje Total: <strong style="color: #0f172a; font-size: 16px;">${score} de 45 puntos</strong></p>
          </div>

          <!-- Answers Section -->
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px;">3. Respuestas Detalladas</h2>
          <div style="background-color: #fafafa; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; max-height: 400px; overflow-y: auto;">
            ${answersListHtml}
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 15px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 500;">Este es un correo automático enviado por el sistema del Diagnóstico Inteligente de Wadil AI Studio.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Standard plain text version
  const textContent = `
NUEVA SOLICITUD DE SESIÓN EJECUTIVA - WADIL AI STUDIO

1. DATOS DE CONTACTO:
- Nombre: ${displayName}
- Email: ${displayEmail}
- Teléfono: ${phone}

2. RESULTADO DEL DIAGNÓSTICO:
- Nivel obtenido: ${level}
- Puntaje total: ${score} de 45 puntos

3. RESPUESTAS DETALLADAS:
${answersListText}

---
Correo automático de Diagnóstico Inteligente de Wadil AI Studio.
  `;

  try {
    if (!smtpUser || !smtpPass) {
      console.warn("⚠️ Advertencia: No se han configurado SMTP_USER o SMTP_PASS en las variables de entorno.");
      console.log("Simulación de envío de correo exitosa. Datos de la solicitud:");
      console.log(textContent);
      
      return res.status(200).json({ 
        success: true, 
        simulated: true, 
        message: 'Correo registrado y simulado exitosamente (faltan credenciales SMTP).' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"${displayName} (Diagnóstico)" <${smtpFrom}>`,
      to: 'info@wadil.mx',
      replyTo: email && email.trim() ? email : undefined,
      subject: `🚨 [Nuevo Lead] ${displayName} - Diagnóstico: ${level}`,
      text: textContent,
      html: htmlContent
    });

    console.log('Email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Error al enviar correo:', error);
    return res.status(200).json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Se guardó en Firebase, pero falló el envío de correo de aviso.' 
    });
  }
});

// Vite middleware connection
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
