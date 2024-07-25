<?php
session_start();
include 'conectar.php';

header('Content-Type: application/json');

$response = array();

try {
    if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
        throw new Exception('Acceso denegado');
    }

    if (!isset($_POST['username']) || !isset($_POST['role'])) {
        throw new Exception('Todos los campos son obligatorios.');
    }

    $username = htmlspecialchars($_POST['username']);
    $role = htmlspecialchars($_POST['role']);

    $sql = "UPDATE usuarios SET role = ? WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
    }

    $stmt->bind_param("ss", $role, $username);
    if ($stmt->execute() === false) {
        throw new Exception('Error en la ejecución de la consulta: ' . $stmt->error);
    }

    $response['status'] = 'success';
    $response['message'] = 'Usuario actualizado exitosamente';

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
