<?php
include 'conectar.php';
include 'utilidades.php';

$nombre = sanitizeInput($_POST['nombre']);
$telefono = sanitizeInput($_POST['telefono']);
$email = sanitizeInput($_POST['email']);
$direccion = sanitizeInput($_POST['direccion']);
$fecha_nacimiento = sanitizeInput($_POST['fecha_nacimiento']);
$sexo = sanitizeInput($_POST['sexo']);
$servicio_preferido = sanitizeInput($_POST['servicio_preferido']);
$notas = sanitizeInput($_POST['notas']);

$response = array();

try {
    $sql = "INSERT INTO clientes (nombre, telefono, email, direccion, fecha_nacimiento, sexo, servicio_preferido, notas) VALUES ('$nombre', '$telefono', '$email', '$direccion', '$fecha_nacimiento', '$sexo', '$servicio_preferido', '$notas')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
