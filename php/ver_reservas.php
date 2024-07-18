<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM reservas";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $reservas = array();
    while ($row = $result->fetch_assoc()) {
        $reservas[] = $row;
    }

    if (count($reservas) > 0) {
        $response['status'] = 'success';
        $response['reservas'] = $reservas;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron reservas';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
