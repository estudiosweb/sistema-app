<?php
include 'conectar.php';

$response = array();

try {
    $busqueda = isset($_GET['busqueda']) ? $_GET['busqueda'] : '';
    
    $sql = "SELECT reservas.id, reservas.fecha_reserva, reservas.hora_reserva, clientes.nombre AS cliente_nombre, servicios.nombre AS servicio_nombre 
            FROM reservas
            JOIN clientes ON reservas.cliente_id = clientes.id
            JOIN servicios ON reservas.servicio_id = servicios.id";
            
    if (!empty($busqueda)) {
        $sql .= " WHERE clientes.nombre LIKE '%$busqueda%' OR servicios.nombre LIKE '%$busqueda%'";
    }
    
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $reservas = array();
    while ($row = $result->fetch_assoc()) {
        $reservas[] = array(
            'id' => $row['id'],
            'cliente_nombre' => $row['cliente_nombre'],
            'servicio_nombre' => $row['servicio_nombre'],
            'fecha_reserva' => $row['fecha_reserva'],
            'hora_reserva' => $row['hora_reserva']
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
