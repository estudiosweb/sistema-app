<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT id, nombre FROM categorias";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response['status'] = 'success';
        $response['categorias'] = array();
        while ($row = $result->fetch_assoc()) {
            $response['categorias'][] = $row;
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron categorías.';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
