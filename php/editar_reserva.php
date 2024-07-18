<?php
include 'conectar.php';

$id = $_POST['id'];
$nombre = $_POST['nombre'];
$telefono = $_POST['telefono'];
$email = $_POST['email'];
$direccion = $_POST['direccion'];

$sql = "UPDATE clientes SET nombre='$nombre', telefono='$telefono', email='$email', direccion='$direccion' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo "Cliente actualizado exitosamente";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>

