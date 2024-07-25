<?php
session_start();
include 'conectar.php';

header('Content-Type: application/json');

$response = array();

try {
    if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
        throw new Exception('Acceso denegado');
    }

    if (!isset($_GET['username'])) {
        throw new Exception('Nombre de usuario no proporcionado');
    }

    $username = htmlspecialchars($_GET['username']);

    $sql = "DELETE FROM usuarios WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
    }

    $stmt->bind_param("s", $username);
    if ($stmt->execute() === false) {
        throw new Exception('Error en la ejecución de la consulta: ' . $stmt->error);
    }

    $response['status'] = 'success';
    $response['message'] = 'Usuario eliminado exitosamente';
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
