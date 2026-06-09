<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Use POST"]);
    exit();
}

require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$inputRaw = file_get_contents("php://input");
$data = json_decode($inputRaw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
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
    echo json_encode(["success" => false, "error" => "Falta teléfono"]);
    exit();
}

$displayName = !empty($name) ? $name : 'No proporcionado';
$displayEmail = !empty($email) ? $email : 'No proporcionado';

$answersListHtml = '';
if (is_array($answers) && count($answers) > 0) {
    foreach ($answers as $idx => $ans) {
        $qText = isset($ans['questionText']) ? htmlspecialchars($ans['questionText']) : '';
        $aLabel = isset($ans['answerLabel']) ? htmlspecialchars($ans['answerLabel']) : '';
        $points = isset($ans['points']) ? intval($ans['points']) : 0;
        $answersListHtml .= '
        <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0;font-weight:bold;color:#1e293b;">' . ($idx + 1) . '. ' . $qText . '</p>
          <p style="margin:5px 0 0 0;color:#475569;">Respuesta: <strong>' . $aLabel . '</strong> (' . $points . ' pts)</p>
        </div>';
    }
} else {
    $answersListHtml = '<p>No se registraron respuestas detalladas.</p>';
}

$cleanPhone = preg_replace('/[^0-9]/', '', $phone);

$htmlContent = '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nueva Solicitud de Diagnóstico</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;padding:20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">Nueva Solicitud de Sesión</h1>
      <p style="color:#94a3b8;margin:5px 0 0 0;font-size:14px;">Diagnóstico de Madurez Empresarial</p>
    </div>
    <div style="padding:30px;">
      <h2 style="font-size:18px;color:#0f172a;border-bottom:2px solid #f1f5f9;padding-bottom:8px;">1. Datos de Contacto</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:25px;">
        <tr><td style="padding:8px 0;color:#64748b;width:120px;">Nombre:</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">' . htmlspecialchars($displayName) . '</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email:</td><td style="padding:8px 0;color:#1e293b;font-weight:600;">' . (!empty($email) ? '<a href="mailto:' . htmlspecialchars($email) . '" style="color:#2563eb;">' . htmlspecialchars($email) . '</a>' : 'No proporcionado') . '</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Teléfono:</td><td style="padding:8px 0;color:#1e293b;font-weight:600;"><a href="https://wa.me/' . $cleanPhone . '" style="color:#10b981;">' . htmlspecialchars($phone) . ' (WhatsApp)</a></td></tr>
      </table>
      <h2 style="font-size:18px;color:#0f172a;border-bottom:2px solid #f1f5f9;padding-bottom:8px;">2. Resultado del Diagnóstico</h2>
      <div style="background-color:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:25px;border-left:4px solid #cc1f26;">
        <p style="margin:0;color:#475569;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Nivel Obtenido</p>
        <p style="margin:5px 0 0 0;font-size:20px;font-weight:bold;color:#0f172a;">' . htmlspecialchars($level) . '</p>
        <p style="margin:10px 0 0 0;font-size:14px;color:#475569;">Puntaje Total: <strong style="color:#0f172a;">' . $score . ' de 45 puntos</strong></p>
      </div>
      <h2 style="font-size:18px;color:#0f172a;border-bottom:2px solid #f1f5f9;padding-bottom:8px;">3. Respuestas Detalladas</h2>
      <div style="background-color:#fafafa;border:1px solid #f1f5f9;border-radius:12px;padding:20px;">' . $answersListHtml . '</div>
    </div>
    <div style="background-color:#f8fafc;padding:15px 30px;text-align:center;border-top:1px solid #f1f5f9;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">Correo automático del Diagnóstico Inteligente Wadil.</p>
    </div>
  </div>
</body>
</html>';

$sent = false;
$errorMsg = '';

// Try SMTP via send.smtp.com
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'send.smtp.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@wadil.mx';
    $mail->Password   = 'wad10woR';
    $mail->SMTPSecure = false;
    $mail->Port       = 80;
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]];
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = 'base64';

    $mail->setFrom('noreply@wadil.mx', 'Diagnóstico Wadil');
    if (!empty($email)) {
        $mail->addReplyTo($email, $displayName);
    }
    $mail->addAddress('info@wadil.mx');

    $mail->Subject = "Nuevo Lead - $displayName - Diagnóstico: $level";
    $mail->isHTML(true);
    $mail->Body = $htmlContent;
    $mail->AltBody = strip_tags(str_replace(['</div>','</p>','</tr>'], "\n", $htmlContent));

    $mail->send();
    $sent = true;
} catch (Exception $e) {
    $errorMsg = $mail->ErrorInfo;
    error_log("SMTP.com failed, trying mail(): $errorMsg");
}

// Fallback to mail() if SMTP fails
if (!$sent) {
    try {
        $mail = new PHPMailer(true);
        $mail->isMail();
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Encoding = 'base64';

        $mail->setFrom('noreply@wadil.mx', 'Diagnóstico Wadil');
        if (!empty($email)) {
            $mail->addReplyTo($email, $displayName);
        }
        $mail->addAddress('info@wadil.mx');

        $mail->Subject = "Nuevo Lead - $displayName - Diagnóstico: $level";
        $mail->isHTML(true);
        $mail->Body = $htmlContent;
        $mail->AltBody = strip_tags(str_replace(['</div>','</p>','</tr>'], "\n", $htmlContent));

        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        $errorMsg = $mail->ErrorInfo;
    }
}

if ($sent) {
    echo json_encode(["success" => true, "message" => "Correo enviado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $errorMsg]);
}
