<?php
include 'conectar.php';

$response = array();

try {
    $busqueda = filter_input(INPUT_GET, 'busqueda', FILTER_SANITIZE_STRING);

    $sql = "SELECT reservas.id, reservas.fecha_reserva, reservas.hora_reserva, reservas.comentario, 
            clientes.nombre AS cliente_nombre, servicios.nombre AS servicio_nombre, 
            personal.nombre AS personal_nombre, servicios.duracion 
            FROM reservas
            JOIN clientes ON reservas.cliente_id = clientes.id
            JOIN servicios ON reservas.servicio = servicios.id
            JOIN personal ON reservas.personal_id = personal.id";
    $params = [];

    if ($busqueda) {
        $sql .= " WHERE clientes.nombre LIKE ? OR servicios.nombre LIKE ?";
        $busquedaParam = '%' . $busqueda . '%';
        $params[] = $busquedaParam;
        $params[] = $busquedaParam;
    }

    $stmt = $conn->prepare($sql);

    if ($params) {
        $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $reservas = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reservas[] = $row;
        }
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
