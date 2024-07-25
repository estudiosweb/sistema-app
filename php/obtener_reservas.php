<?php
include 'conectar.php';

$busqueda = $_GET['busqueda'] ?? '';

$sql = "SELECT 
            reservas.id, 
            reservas.fecha_reserva, 
            reservas.hora_reserva, 
            reservas.comentario, 
            clientes.nombre AS cliente_nombre, 
            servicios.nombre AS servicio_nombre, 
            personal.nombre AS personal_nombre, 
            servicios.duracion 
        FROM 
            reservas
        JOIN 
            clientes ON reservas.cliente_id = clientes.id
        JOIN 
            servicios ON reservas.servicio = servicios.id
        JOIN 
            personal ON reservas.personal_id = personal.id";

if ($busqueda) {
    $sql .= " WHERE clientes.nombre LIKE '%$busqueda%' OR servicios.nombre LIKE '%$busqueda%'";
}

$result = $conn->query($sql);

$reservas = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $reservas[] = $row;
    }
}

echo json_encode(['status' => 'success', 'reservas' => $reservas]);

$conn->close();
?>
