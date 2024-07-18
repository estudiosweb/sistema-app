<?php
include 'conectar.php';
include 'utilidades.php';

$nombre = sanitizeInput($_POST['nombre']);
$cargo = sanitizeInput($_POST['cargo']);
$bio = sanitizeInput($_POST['bio']);
$email = sanitizeInput($_POST['email']);
$telefono = sanitizeInput($_POST['telefono']);
$direccion = sanitizeInput($_POST['direccion']);

$response = array();

try {
    $sql = "INSERT INTO personal (nombre, cargo, bio, email, telefono, direccion) VALUES ('$nombre', '$cargo', '$bio', '$email', '$telefono', '$direccion')";
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
