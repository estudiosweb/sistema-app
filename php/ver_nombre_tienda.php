<?php
include 'conectar.php';

$sql = "SELECT nombre_negocio FROM configuracion LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['nombre_negocio' => $row['nombre_negocio']]);
} else {
    echo json_encode(['nombre_negocio' => 'Nombre del Salón']);
}

$conn->close();
?>
