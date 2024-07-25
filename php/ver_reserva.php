<?php
include 'conectar.php';
include 'verificar_sesion.php'; // Verifica que el usuario está autenticado
include 'utilidades.php'; // Incluye funciones de utilidad

$response = array();

try {
    if (!verificarSesion('user')) {
        throw new Exception("Acceso no autorizado");
    }

    $busqueda = isset($_GET['busqueda']) ? sanitizeInput($_GET['busqueda']) : '';

    $sql = "SELECT reservas.id, reservas.fecha_reserva, reservas.hora_reserva, clientes.nombre AS cliente_nombre, servicios.nombre AS servicio_nombre 
            FROM reservas
            JOIN clientes ON reservas.cliente_id = clientes.id
            JOIN servicios ON reservas.servicio_id = servicios.id";
    
    if (!empty($busqueda)) {
        $sql .= " WHERE clientes.nombre LIKE ? OR servicios.nombre LIKE ?";
        $stmt = $conn->prepare($sql);
        $param = '%' . $busqueda . '%';
        $stmt->bind_param('ss', $param, $param);
    } else {
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $reservas = array();
        while ($row = $result->fetch_assoc()) {
            $reservas[] = array(
                'id' => $row['id'],
                'cliente_nombre' => $row['cliente_nombre'],
                'servicio_nombre' => $row['servicio_nombre'],
                'fecha_reserva' => $row['fecha_reserva'],
                'hora_reserva' => $row['hora_reserva']
            );
        }
        $response['status'] = 'success';
        $response['reservas'] = $reservas;
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontraron reservas';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
