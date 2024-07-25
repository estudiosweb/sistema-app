<?php
include 'conectar.php';

$response = array();

try {
    // Sanitizar la entrada de id
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        
        // Consulta preparada para evitar inyección SQL
        $sql = "SELECT p.*, GROUP_CONCAT(s.id, ':', s.nombre SEPARATOR ',') as servicios
                FROM personal p
                LEFT JOIN personal_servicios ps ON p.id = ps.personal_id
                LEFT JOIN servicios s ON ps.servicio_id = s.id
                WHERE p.id = ?
                GROUP BY p.id";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $personal = $result->fetch_assoc();
            if (!empty($personal['servicios'])) {
                $personal['servicios'] = array_map(function($servicio) {
                    $parts = explode(':', $servicio);
                    return ['id' => intval($parts[0]), 'nombre' => $parts[1] ?? ''];
                }, explode(',', $personal['servicios']));
            } else {
                $personal['servicios'] = [];
            }
            $response['status'] = 'success';
            $response['personal'] = $personal;
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Personal no encontrado';
        }
    } else {
        // Consulta para obtener todos los registros de personal
        $sql = "SELECT p.*, GROUP_CONCAT(s.id, ':', s.nombre SEPARATOR ',') as servicios
                FROM personal p
                LEFT JOIN personal_servicios ps ON p.id = ps.personal_id
                LEFT JOIN servicios s ON ps.servicio_id = s.id
                GROUP BY p.id";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $personal = array();
            while($row = $result->fetch_assoc()) {
                if (!empty($row['servicios'])) {
                    $row['servicios'] = array_map(function($servicio) {
                        $parts = explode(':', $servicio);
                        return ['id' => intval($parts[0]), 'nombre' => $parts[1] ?? ''];
                    }, explode(',', $row['servicios']));
                } else {
                    $row['servicios'] = [];
                }
                $personal[] = $row;
            }
            $response['status'] = 'success';
            $response['personal'] = $personal;
        } else {
            $response['status'] = 'error';
            $response['message'] = 'No se encontró personal';
        }
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
