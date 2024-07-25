<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'conectar.php';
include 'utilidades.php';

header('Content-Type: application/json');

// Inicializar respuesta
$response = array('status' => 'error', 'message' => '');

try {
    // Verificar que los datos necesarios están presentes
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception('Username and password are required.');
    }

    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);

    // Preparar y ejecutar la consulta SQL
    $sql = "SELECT * FROM usuarios WHERE username=?";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception('Error en la preparación de la consulta: ' . $conn->error);
    }

    $stmt->bind_param("s", $username);
    if ($stmt->execute() === false) {
        throw new Exception('Error en la ejecución de la consulta: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Autenticación exitosa
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $user['role'];
            $response['status'] = 'success';
            $response['redirect'] = 'index.html';
        } else {
            // Contraseña incorrecta
            throw new Exception('Contraseña incorrecta');
        }
    } else {
        // Usuario no encontrado
        throw new Exception('Usuario no encontrado');
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Manejo de errores
    $response['message'] = $e->getMessage();
}

// Enviar respuesta JSON
echo json_encode($response);
?>
