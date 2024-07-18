<?php
include 'conectar.php';

$response = array();

try {
    $id = intval($_GET['id']);
    $sql = "SELECT servicios.*, categorias.nombre as categoria_nombre 
            FROM servicios 
            JOIN categorias ON servicios.categoria_id = categorias.id
            WHERE servicios.id='$id'";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        $response['status'] = 'success';
        $response['servicio'] = $result->fetch_assoc();
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Servicio no encontrado';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
