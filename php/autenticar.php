<?php
include 'conectar.php';
include 'utilidades.php';

$username = sanitizeInput($_POST['username']);
$password = sanitizeInput($_POST['password']);

$response = array();

try {
    $sql = "SELECT * FROM usuarios WHERE username='$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $user['role'];
            $response['status'] = 'success';
        } else {
            throw new Exception('Contraseña incorrecta');
        }
    } else {
        throw new Exception('Usuario no encontrado');
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
