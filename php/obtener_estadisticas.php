<?php
include 'conectar.php';

$response = array();

try {
    // Obtener el total de reservas de hoy
    $today = date('Y-m-d');
    $sql = "SELECT COUNT(*) as total FROM reservas WHERE DATE(fecha_reserva) = '$today'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $response['totalReservasHoy'] = $row['total'];

    // Obtener el total de horas disponibles (supongamos que la jornada laboral es de 8 horas)
    $response['horasDisponibles'] = 8;

    // Obtener el total de profesionales disponibles (ejemplo: todos los profesionales)
    $sql = "SELECT COUNT(*) as total FROM personal";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $response['profesionalesDisponibles'] = $row['total'];

    // Añadir nuevas estadísticas

    // Obtener el total de reservas
    $sqlTotal = "SELECT COUNT(*) AS totalReservas FROM reservas";
    $resultTotal = $conn->query($sqlTotal);
    if (!$resultTotal) {
        throw new Exception("Error al obtener el total de reservas: " . $conn->error);
    }
    $totalReservas = $resultTotal->fetch_assoc()['totalReservas'];

    // Obtener las reservas por día
    $sqlReservasPorDia = "SELECT DATE_FORMAT(fecha_reserva, '%d-%m-%y') AS dia, COUNT(*) AS cantidad FROM reservas GROUP BY fecha_reserva ORDER BY fecha_reserva";
    $resultReservasPorDia = $conn->query($sqlReservasPorDia);
    if (!$resultReservasPorDia) {
        throw new Exception("Error al obtener las reservas por día: " . $conn->error);
    }

    $reservasPorDia = [];
    while ($row = $resultReservasPorDia->fetch_assoc()) {
        $reservasPorDia[] = $row;
    }

    // Añadir nuevas estadísticas al response
    $response['totalReservas'] = $totalReservas;
    $response['reservasPorDia'] = $reservasPorDia;

    $response['status'] = 'success';
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
