<?php
include 'conectar.php';

$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';

if ($nombre && $email && $telefono) {
    $sql = "INSERT INTO clientes (nombre, email, telefono) VALUES ('$nombre', '$email', '$telefono')";
    if ($conn->query($sql) === TRUE) {
        echo "Nuevo cliente agregado exitosamente";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} else {
    echo "Todos los campos son obligatorios";
}

$conn->close();
?>
