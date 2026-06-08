<?php
/**
 * Script de envío de correos por PHP para el Diagnóstico Inteligente Wadil
 * 
 * Permite procesar los resultados del diagnóstico empresarial y enviarlos por correo
 * utilizando la función nativa mail() de PHP (sin configuración requerida en la mayoría de hostings)
 * o configurando opcionalmente parámetros personalizados.
 */

// Habilitar CORS y cabeceras JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Manejo de peticiones preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Asegurar que es una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido. Utilre POST."]);
    exit();
}

// Obtener el cuerpo de la petición JSON
$inputRaw = file_get_contents("php://input");
$data = json_decode($inputRaw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Datos JSON no válidos o vacíos."]);
    exit();
}

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$score = isset($data['score']) ? intval($data['score']) : 0;
$level = isset($data['level']) ? trim($data['level']) : 'No calculado';
$answers = isset($data['answers']) ? $data['answers'] : [];

if (empty($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Falta el número de teléfono o WhatsApp."]);
    exit();
}

$displayName = !empty($name) ? $name : 'No proporcionado';
$displayEmail = !empty($email) ? $email : 'No proporcionado';

// Destinatario y Remitente - MODIFICAR AQUÍ SI ES NECESARIO
$toEmail = 'info@wadil.mx';
$fromEmail = !empty($email) ? $email : 'diagnostico@wadil.mx';

// Formatear respuestas detaladas en HTML
$answersListHtml = '';
if (is_array($answers) && count($answers) > 0) {
    foreach ($answers as $idx => $ans) {
        $qText = isset($ans['questionText']) ? htmlspecialchars($ans['questionText']) : '';
        $aLabel = isset($ans['answerLabel']) ? htmlspecialchars($ans['answerLabel']) : '';
        $points = isset($ans['points']) ? intval($ans['points']) : 0;
        
        $answersListHtml .= '
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
          <p style="margin: 0; font-weight: bold; color: #1e293b;">' . ($idx + 1) . '. ' . $qText . '</p>
          <p style="margin: 5px 0 0 0; color: #475569;">Respuesta: <strong>' . $aLabel . '</strong> (' . $points . ' pts)</p>
        </div>';
    }
} else {
    $answersListHtml = '<p>No se registraron respuestas detalladas.</p>';
}

// Formatear versión de texto plano
$answersListText = '';
if (is_array($answers) && count($answers) > 0) {
    foreach ($answers as $idx => $ans) {
        $qText = isset($ans['questionText']) ? $ans['questionText'] : '';
        $aLabel = isset($ans['answerLabel']) ? $ans['answerLabel'] : '';
        $points = isset($ans['points']) ? intval($ans['points']) : 0;
        $answersListText .= ($idx + 1) . ". " . $qText . "\n   Respuesta: " . $aLabel . " (" . $points . " pts)\n\n";
    }
} else {
    $answersListText = 'No se registraron respuestas detalladas.';
}

// Asunto del Correo
$subject = "🚨 [Nuevo Lead PHP] " . $displayName . " - Diagnóstico: " . $level;

// Servidor de destino limpio de WhatsApp
$cleanPhone = preg_replace('/[^0-9]/', '', $phone);

// Construir contenido HTML
$htmlContent = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Solicitud de Diagnóstico - Wadil AI Studio</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 20px; margin: 0; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <!-- Dark Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">Nueva Solicitud de Sesión (PHP)</h1>
      <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Diagnóstico de Madurez Empresarial</p>
    </div>
    
    <div style="padding: 30px;">
      <!-- Contact Info Section -->
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">1. Datos de Contacto</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 120px;">Nombre:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">' . htmlspecialchars($displayName) . '</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Email:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">
            ' . (!empty($email) ? '<a href="mailto:' . htmlspecialchars($email) . '" style="color: #2563eb; text-decoration: none;">' . htmlspecialchars($email) . '</a>' : 'No proporcionado') . '
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Teléfono:</td>
          <td style="padding: 8px 0; color: #1e293b; font-weight: 600;"><a href="https://wa.me/' . $cleanPhone . '" style="color: #10b981; text-decoration: none; font-weight: bold;">' . htmlspecialchars($phone) . ' 💬 (WhatsApp)</a></td>
        </tr>
      </table>

      <!-- Diagnostic Result Section -->
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0;">2. Resultado del Diagnóstico</h2>
      <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #cc1f26;">
        <p style="margin: 0; color: #475569; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Nivel Obtenido</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 850; color: #0f172a;">' . htmlspecialchars($level) . '</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;">Puntaje Total: <strong style="color: #0f172a; font-size: 16px;">' . $score . ' de 45 puntos</strong></p>
      </div>

      <!-- Answers Section -->
      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px;">3. Respuestas Detalladas</h2>
      <div style="background-color: #fafafa; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; max-height: 400px; overflow-y: auto;">
        ' . $answersListHtml . '
      </div>
    </div>

    <div style="background-color: #f8fafc; padding: 15px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 500;">Este es un correo automático enviado por el sistema de Diagnóstico Inteligente de Wadil.</p>
    </div>
  </div>
</body>
</html>
';

// Cabeceras de correo para formato multipart
$boundary = uniqid('np');

$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: Diagnostico Wadil <" . $fromEmail . ">\r\n";
if (!empty($email)) {
    $headers .= "Reply-To: " . $email . "\r\n";
}
$headers .= "Content-Type: multipart/alternative; boundary=" . $boundary . "\r\n";

// Cuerpo del mensaje (Multipart para texto plano y HTML)
$messageBody = "This is a multi-part message in MIME format.\r\n\r\n";
$messageBody .= "--" . $boundary . "\r\n";
$messageBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
$messageBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$messageBody .= $answersListText . "\r\n\r\n";
$messageBody .= "--" . $boundary . "\r\n";
$messageBody .= "Content-Type: text/html; charset=UTF-8\r\n";
$messageBody .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$messageBody .= $htmlContent . "\r\n\r\n";
$messageBody .= "--" . $boundary . "--";

// Enviar el correo usando la función nativa mail() de PHP
$mailSuccess = mail($toEmail, $subject, $messageBody, $headers);

if ($mailSuccess) {
    echo json_encode([
        "success" => true, 
        "message" => "Correo electrónico enviado correctamente a través del servidor PHP."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "El servidor de correo PHP rechazó el mensaje. Comprueba la configuración de PHP sendmail."
    ]);
}
?>
