<?php
include 'conectar.php';

$response = array();

try {
    $fecha = $_GET['fecha'];
    $sql = "SELECT hora_reserva FROM reservas WHERE fecha_reserva = '$fecha'";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta SQL: " . $conn->error);
    }

    $horas_ocupadas = array();
    while ($row = $result->fetch_assoc()) {
        $horas_ocupadas[] = $row['hora_reserva'];
    }

    // Generar horas disponibles
    $horas_disponibles = array();
    $intervalos = array('08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00');

    foreach ($intervalos as $hora) {
        if (!in_array($hora, $horas_ocupadas)) {
            $horas_disponibles[] = $hora;
        }
    }

    $response['status'] = 'success';
    $response['horas'] = $horas_disponibles;
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
