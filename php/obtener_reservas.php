<?php
include 'conectar.php';

$busqueda = $_GET['busqueda'] ?? '';

$sql = "SELECT * FROM reservas";
if ($busqueda) {
    $sql .= " WHERE nombre_cliente LIKE '%$busqueda%' OR servicio LIKE '%$busqueda%'";
}

$result = $conn->query($sql);

$reservas = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $reservas[] = $row;
    }
}

echo json_encode($reservas);

$conn->close();
?>
