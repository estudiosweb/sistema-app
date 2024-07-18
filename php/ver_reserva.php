<?php
require 'conectar.php';
$id = intval($_GET['id']);
$response = array();

$sql = "SELECT * FROM reservas WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response['status'] = 'success';
    $response['reserva'] = $result->fetch_assoc();
} else {
    $response['status'] = 'error';
    $response['message'] = 'Reserva no encontrada';
}

header('Content-Type: application/json');
echo json_encode($response);
?>
