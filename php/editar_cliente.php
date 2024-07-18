<?php
include 'conectar.php';
include 'utilidades.php';

$id = sanitizeInput($_POST['id']);
$nombre = sanitizeInput($_POST['nombre']);
$telefono = sanitizeInput($_POST['telefono']);
$email = sanitizeInput($_POST['email']);
$direccion = sanitizeInput($_POST['direccion']);

$response = array();

try {
    $sql = "UPDATE clientes SET nombre='$nombre', telefono='$telefono', email='$email', direccion='$direccion' WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Cliente actualizado exitosamente';
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
