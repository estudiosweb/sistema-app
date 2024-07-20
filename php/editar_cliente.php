<?php
include 'conectar.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    if (empty($_POST['nombre']) || empty($_POST['telefono'])) {
        echo json_encode(['status' => 'error', 'message' => 'Los campos Nombre y Teléfono son obligatorios']);
        exit();
    }

    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $sexo = $_POST['sexo'];
    $servicio_preferido = $_POST['servicio_preferido'];
    $notas = $_POST['notas'];
    $direccion = $_POST['direccion'];

    $sql = "UPDATE clientes SET nombre = ?, telefono = ?, email = ?, fecha_nacimiento = ?, sexo = ?, servicio_preferido = ?, notas = ?, direccion = ? WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssi', $nombre, $telefono, $email, $fecha_nacimiento, $sexo, $servicio_preferido, $notas, $direccion, $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el cliente']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
