<?php
include 'conectar.php';
include 'utilidades.php';

$data = json_decode(file_get_contents('php://input'), true);
$nombre = sanitizeInput($data['nombre']);
$response = array();

try {
    $sql = "INSERT INTO categorias (nombre) VALUES ('$nombre')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Categoría agregada exitosamente';
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
