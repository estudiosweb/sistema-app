<?php
include 'conectar.php';

$response = array();

try {
    $id = intval($_GET['id']);

    $sql = "DELETE FROM reservas WHERE id='$id'";

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al eliminar la reserva: " . $conn->error);
    }

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
