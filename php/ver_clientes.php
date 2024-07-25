<?php
include 'conectar.php';

$response = array();

try {
    $term = isset($_GET['q']) ? $_GET['q'] : '';
    
    if ($term !== '') {
        $sql = "SELECT id, nombre FROM clientes WHERE nombre LIKE ? LIMIT 10";
        $stmt = $conn->prepare($sql);
        $term = '%' . $term . '%';
        $stmt->bind_param('s', $term);
    } else {
        $sql = "SELECT * FROM clientes";
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $clientes = array();
    while ($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }

    $response['status'] = 'success';
    $response['clientes'] = $clientes;
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
