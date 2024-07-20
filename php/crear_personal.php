<?php
include 'conectar.php';

$response = array();

try {
    $nombre = $_POST['nombre'];
    $cargo = $_POST['cargo'];
    $bio = $_POST['bio'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $direccion = $_POST['direccion'];

    $sql = "INSERT INTO personal (nombre, cargo, bio, email, telefono, direccion) VALUES ('$nombre', '$cargo', '$bio', '$email', '$telefono', '$direccion')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al insertar el personal: " . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
