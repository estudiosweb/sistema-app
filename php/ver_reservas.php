<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT reservas.id, reservas.fecha_reserva, reservas.hora_reserva, clientes.nombre AS cliente_nombre, servicios.nombre AS servicio_nombre 
            FROM reservas
            JOIN clientes ON reservas.cliente_id = clientes.id
            JOIN servicios ON reservas.servicio_id = servicios.id";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $reservas = array();
    while ($row = $result->fetch_assoc()) {
        $reservas[] = array(
            'title' => $row['cliente_nombre'] . ' - ' . $row['servicio_nombre'],
            'start' => $row['fecha_reserva'] . 'T' . $row['hora_reserva'],
            'id' => $row['id']
        );
    }

    $response['status'] = 'success';
    $response['reservas'] = $reservas;
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
