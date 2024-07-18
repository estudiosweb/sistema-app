<?php
include 'conectar.php';
include 'utilidades.php';

$nombre = sanitizeInput($_POST['nombreServicio']);
$categoria = sanitizeInput($_POST['categoriaServicio']);
$duracion = sanitizeInput($_POST['duracionServicio']);
$precio = sanitizeInput($_POST['precioServicio']);
$descripcion = sanitizeInput($_POST['descripcionServicio']);

$response = array();

try {
    $sql = "INSERT INTO servicios (nombre, categoria, duracion, precio, descripcion) VALUES ('$nombre', '$categoria', '$duracion', '$precio', '$descripcion')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Servicio agregado exitosamente';
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
