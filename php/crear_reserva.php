<?php
include 'conectar.php';

$cliente_id = $_POST['cliente_id'];
$fecha_reserva = $_POST['fecha_reserva'];
$servicio = $_POST['servicio'];

$sql = "INSERT INTO reservas (cliente_id, fecha_reserva, servicio) VALUES ('$cliente_id', '$fecha_reserva', '$servicio')";

if ($conn->query($sql) === TRUE) {
    echo "Nueva reserva creada exitosamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
