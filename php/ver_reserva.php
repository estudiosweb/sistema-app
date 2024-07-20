<?php
include 'conectar.php';

$response = array();

try {
    $id = intval($_GET['id']);
    $sql = "SELECT reservas.id, clientes.nombre as cliente_nombre, servicios.nombre as servicio_nombre, reservas.fecha_reserva, reservas.hora_reserva, reservas.cliente_id, reservas.servicio_id 
            FROM reservas 
            JOIN clientes ON reservas.cliente_id = clientes.id
            JOIN servicios ON reservas.servicio_id = servicios.id
            WHERE reservas.id = '$id'";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        $response['status'] = 'success';
        $response['reserva'] = $result->fetch_assoc();
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Reserva no encontrada';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
