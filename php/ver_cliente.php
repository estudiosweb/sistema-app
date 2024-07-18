<?php
include 'conectar.php';

$response = array();

try {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql = "SELECT * FROM clientes WHERE id = $id";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['cliente'] = $result->fetch_assoc();
        } else {
            throw new Exception("Cliente no encontrado.");
        }
    } else {
        throw new Exception("ID de cliente no especificado.");
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
