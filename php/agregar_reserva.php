<?php
include 'conectar.php';

$cliente_id = $_POST['cliente_id'] ?? '';
$servicio = $_POST['servicio'] ?? '';
$fecha = $_POST['fecha'] ?? '';
$hora = $_POST['hora'] ?? '';

if ($cliente_id && $servicio && $fecha && $hora) {
    $fecha_reserva = "$fecha $hora";
    $sql = "INSERT INTO reservas (cliente_id, fecha_reserva, servicio) VALUES ('$cliente_id', '$fecha_reserva', '$servicio')";
    if ($conn->query($sql) === TRUE) {
        echo "Nueva reserva agregada exitosamente";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} else {
    echo "Todos los campos son obligatorios";
}

$conn->close();
?>

