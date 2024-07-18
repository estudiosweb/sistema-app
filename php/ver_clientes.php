<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM clientes";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $clientes = array();
    while ($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }

    if (count($clientes) > 0) {
        $response['status'] = 'success';
        $response['clientes'] = $clientes;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron clientes';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
