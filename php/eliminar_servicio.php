<?php
include 'conectar.php';

$id = $_GET['id'];

if ($id) {
    $sql = "DELETE FROM servicios WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Servicio eliminado exitosamente';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Error al eliminar el servicio: ' . $conn->error;
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'ID del servicio no proporcionado';
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
