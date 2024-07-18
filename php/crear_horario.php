<?php
include 'conectar.php';
include 'utilidades.php';

$dias = sanitizeInput($_POST['diasAtencion']);
$horas = sanitizeInput($_POST['horasAtencion']);

$response = array();

try {
    $sql = "INSERT INTO horarios (dias, horas) VALUES ('$dias', '$horas')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Horario agregado exitosamente';
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>