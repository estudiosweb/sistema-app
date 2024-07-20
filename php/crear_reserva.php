<?php
include 'conectar.php';

$response = array();

try {
    $cliente_id = $_POST['cliente_id'];
    $servicio_id = $_POST['servicio'];
    $fecha_reserva = $_POST['fecha_reserva'];
    $hora_reserva = $_POST['hora_reserva'];

    $sql = "INSERT INTO reservas (cliente_id, servicio_id, fecha_reserva, hora_reserva) 
            VALUES ('$cliente_id', '$servicio_id', '$fecha_reserva', '$hora_reserva')";

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al insertar la reserva: " . $conn->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
