<?php
include 'conectar.php';

$response = array();

try {
    $type = $_GET['type'];
    $query = $_GET['q'];

    if ($type == 'cliente') {
        $sql = "SELECT id, nombre FROM clientes WHERE nombre LIKE '%$query%'";
    } else {
        $sql = "SELECT id, nombre FROM servicios WHERE nombre LIKE '%$query%'";
    }

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    if (count($data) > 0) {
        $response['status'] = 'success';
        if ($type == 'cliente') {
            $response['clientes'] = $data;
        } else {
            $response['servicios'] = $data;
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron resultados';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
