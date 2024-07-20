<?php
include 'conectar.php';

$response = array();

try {
    $dia = $_POST['dia'];
    $hora_inicio = $_POST['hora_inicio'];
    $hora_fin = $_POST['hora_fin'];

    $sql = "INSERT INTO horarios (dia, hora_inicio, hora_fin) VALUES ('$dia', '$hora_inicio', '$hora_fin')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al insertar el horario: " . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
