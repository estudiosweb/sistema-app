<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include 'conectar.php';
include 'utilidades.php';

header('Content-Type: application/json');

// Manejo de errores y excepciones
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function($exception) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $exception->getMessage()]);
    exit;
});

$response = [];

try {
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception('Nombre de usuario y contraseña son requeridos');
    }

    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);

    $sql = "SELECT * FROM usuarios WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $user['role'];
            $response['status'] = 'success';
            $response['redirect'] = 'index.html';
        } else {
            throw new Exception('Contraseña incorrecta');
        }
    } else {
        throw new Exception('Usuario no encontrado');
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
