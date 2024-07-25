<?php
include 'conectar.php';

$response = array();

try {
    $id = $_POST['id'];
    $cliente_id = $_POST['cliente_id'];
    $servicio_id = $_POST['servicio'];
    $fecha_reserva = $_POST['fecha_reserva'];
    $hora_reserva = $_POST['hora_reserva'];
    $personal = $_POST['personal'];
    $comentario = $_POST['comentario'];

    $sql = "UPDATE reservas 
            SET cliente_id = ?, servicio_id = ?, fecha_reserva = ?, hora_reserva = ?, personal_id = ?, comentario = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissisi", $cliente_id, $servicio_id, $fecha_reserva, $hora_reserva, $personal, $comentario, $id);

    if ($stmt->execute()) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al actualizar la reserva: " . $stmt->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
