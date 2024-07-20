<?php
include 'conectar.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    if (empty($_POST['nombre']) || empty($_POST['rut']) || empty($_POST['telefono'])) {
        echo json_encode(['status' => 'error', 'message' => 'Los campos Nombre, RUT y Teléfono son obligatorios']);
        exit();
    }

    $nombre = $_POST['nombre'];
    $rut = $_POST['rut'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $sexo = $_POST['sexo'];
    $servicio_preferido = $_POST['servicio_preferido'];
    $notas = $_POST['notas'];
    $direccion = $_POST['direccion'];

    // Verificar si el RUT ya está registrado
    $sql = "SELECT * FROM clientes WHERE rut = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $rut);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'RUT ya registrado']);
        $stmt->close();
        $conn->close();
        exit();
    }

    $stmt->close();

    $sql = "INSERT INTO clientes (nombre, rut, telefono, email, fecha_nacimiento, sexo, servicio_preferido, notas, direccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $nombre, $rut, $telefono, $email, $fecha_nacimiento, $sexo, $servicio_preferido, $notas, $direccion);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al crear el cliente']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
