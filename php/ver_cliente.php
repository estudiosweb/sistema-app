<?php
include 'conectar.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$id = $_GET['id'];

$sql = "SELECT * FROM clientes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $cliente = $result->fetch_assoc();
        echo json_encode(['status' => 'success', 'cliente' => $cliente]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Cliente no encontrado']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener el cliente']);
}

$stmt->close();
$conn->close();
?>
