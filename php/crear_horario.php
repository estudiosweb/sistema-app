<?php
include 'conectar.php';

$response = array();

try {
    $dia = $_POST['dia'];
    $tipo_jornada = $_POST['tipo_jornada'];

    if ($tipo_jornada == 'continuo') {
        $hora_inicio = $_POST['hora_inicio'];
        $hora_fin = $_POST['hora_fin'];
        $sql = "INSERT INTO horarios (dia, tipo_jornada, hora_inicio, hora_fin) VALUES ('$dia', '$tipo_jornada', '$hora_inicio', '$hora_fin')";
    } else {
        $hora_inicio_m = $_POST['hora_inicio_m'];
        $hora_fin_m = $_POST['hora_fin_m'];
        $hora_inicio_t = $_POST['hora_inicio_t'];
        $hora_fin_t = $_POST['hora_fin_t'];
        $sql = "INSERT INTO horarios (dia, tipo_jornada, hora_inicio_m, hora_fin_m, hora_inicio_t, hora_fin_t) VALUES ('$dia', '$tipo_jornada', '$hora_inicio_m', '$hora_fin_m', '$hora_inicio_t', '$hora_fin_t')";
    }

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
