<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM configuracion_tienda LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response['status'] = 'success';
        $response['config'] = $result->fetch_assoc();
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Configuración no encontrada';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>