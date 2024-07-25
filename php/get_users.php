<?php
session_start();
include 'conectar.php';

header('Content-Type: application/json');

$response = array();

try {
    if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
        throw new Exception('Acceso denegado');
    }

    $sql = "SELECT username, role FROM usuarios";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $users = array();
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        $response['status'] = 'success';
        $response['users'] = $users;
    } else {
        throw new Exception('No se encontraron usuarios');
    }

    $conn->close();
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
