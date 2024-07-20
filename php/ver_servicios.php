<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM servicios";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $servicios = array();
    while ($row = $result->fetch_assoc()) {
        $servicios[] = $row;
    }

    if (count($servicios) > 0) {
        $response['status'] = 'success';
        $response['servicios'] = $servicios;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron servicios';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>