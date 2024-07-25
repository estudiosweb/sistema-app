<?php
include 'conectar.php';

$response = array();

try {
    // Obtener parámetros de la solicitud
    $servicio_id = intval($_GET['servicio_id']);
    $fecha = $_GET['fecha'];
    $hora = $_GET['hora'];

    // Validar entradas
    if (empty($servicio_id) || empty($fecha) || empty($hora)) {
        throw new Exception("Parámetros inválidos");
    }

    // Preparar consulta para obtener personal disponible
    $sql = "SELECT p.id, p.nombre 
            FROM personal p
            JOIN personal_servicios ps ON p.id = ps.personal_id
            WHERE ps.servicio_id = ? AND p.id NOT IN (
                SELECT personal_id FROM reservas 
                WHERE fecha_reserva = ? AND hora_reserva = ?
            )";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }
    
    $stmt->bind_param('iss', $servicio_id, $fecha, $hora);
    $stmt->execute();
    $result = $stmt->get_result();

    $personal = array();
    while ($row = $result->fetch_assoc()) {
        $personal[] = array('id' => $row['id'], 'nombre' => $row['nombre']);
    }

    $response['status'] = 'success';
    $response['personal'] = $personal;

} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
