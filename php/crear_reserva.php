<?php
header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado']);
    exit;
}

require 'conectar.php';

$cliente_id = filter_input(INPUT_POST, 'cliente_id', FILTER_VALIDATE_INT);
$servicio = filter_input(INPUT_POST, 'servicio', FILTER_SANITIZE_STRING);
$fecha_reserva = filter_input(INPUT_POST, 'fecha_reserva', FILTER_SANITIZE_STRING);
$hora_reserva = filter_input(INPUT_POST, 'hora_reserva', FILTER_SANITIZE_STRING);
$personal = filter_input(INPUT_POST, 'personal', FILTER_VALIDATE_INT);
$comentario = filter_input(INPUT_POST, 'comentario', FILTER_SANITIZE_STRING);

if (!$cliente_id || !$servicio || !$fecha_reserva || !$hora_reserva || !$personal) {
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos necesarios para crear la reserva.']);
    exit;
}

try {
    $fecha_reserva_dt = DateTime::createFromFormat('Y-m-d', $fecha_reserva);
    $hora_reserva_dt = DateTime::createFromFormat('H:i', $hora_reserva);
    if (!$fecha_reserva_dt || !$hora_reserva_dt) {
        throw new Exception('Formato de fecha u hora inválido.');
    }

    $stmt = $conn->prepare("INSERT INTO reservas (cliente_id, servicio, fecha_reserva, hora_reserva, personal_id, comentario) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
    }

    $stmt->bind_param("isssis", $cliente_id, $servicio, $fecha_reserva_dt->format('Y-m-d'), $hora_reserva_dt->format('H:i'), $personal, $comentario);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        throw new Exception('Error al crear la reserva: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    error_log('Error al crear la reserva: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
