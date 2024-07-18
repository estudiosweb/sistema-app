<?php
include 'conectar.php';
include 'utilidades.php';

$username = sanitizeInput($_POST['username']);
$password = sanitizeInput($_POST['password']);
$role = isset($_POST['role']) ? sanitizeInput($_POST['role']) : 'user';

$response = array();

try {
    // Verificar si el usuario ya existe
    $sql = "SELECT * FROM usuarios WHERE username='$username'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        throw new Exception('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insertar el nuevo usuario
    $sql = "INSERT INTO usuarios (username, password, role) VALUES ('$username', '$hashed_password', '$role')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Usuario registrado exitosamente';
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
