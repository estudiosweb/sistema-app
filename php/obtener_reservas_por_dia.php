<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT DATE_FORMAT(fecha_reserva, '%d-%m-%y') AS dia, COUNT(*) AS cantidad FROM reservas GROUP BY fecha_reserva ORDER BY fecha_reserva";

    $result = $conn->query($sql);

    $reservasPorDia = [];
    while ($row = $result->fetch_assoc()) {
        $reservasPorDia[] = $row;
    }

    $response['status'] = 'success';
    $response['reservasPorDia'] = $reservasPorDia;
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
