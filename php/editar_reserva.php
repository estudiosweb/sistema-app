<?php
include 'conectar.php';

$response = array();

try {
    $id = intval($_POST['id']);
    $cliente_id = $_POST['cliente_id'];
    $servicio_id = $_POST['servicio'];
    $fecha_reserva = $_POST['fecha_reserva'];
    $hora_reserva = $_POST['hora_reserva'];

    $sql = "UPDATE reservas SET cliente_id='$cliente_id', servicio_id='$servicio_id', fecha_reserva='$fecha_reserva', hora_reserva='$hora_reserva' 
            WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al actualizar la reserva: " . $conn->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
