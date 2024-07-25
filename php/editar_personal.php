<?php
include 'conectar.php';
include 'verificar_sesion.php'; // Verifica que el usuario está autenticado
include 'utilidades.php'; // Incluye funciones de utilidad

$response = array();

try {
    if (!verificarSesion('user')) {
        throw new Exception("Acceso no autorizado");
    }

    // Sanear y validar entradas
    $id = intval($_POST['id']);
    $nombre = filter_var(trim($_POST['nombre']), FILTER_SANITIZE_STRING);
    $cargo = filter_var(trim($_POST['cargo']), FILTER_SANITIZE_STRING);
    $bio = filter_var(trim($_POST['bio']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $telefono = filter_var(trim($_POST['telefono']), FILTER_SANITIZE_STRING);
    $direccion = filter_var(trim($_POST['direccion']), FILTER_SANITIZE_STRING);
    $servicio_id = isset($_POST['servicio']) ? intval($_POST['servicio']) : null;

    if (!$nombre || !$cargo || !$email || !$telefono) {
        throw new Exception("Datos inválidos");
    }

    // Manejo de la subida de la foto
    $foto = null;
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
        $foto = 'images/' . basename($_FILES['foto']['name']);
        move_uploaded_file($_FILES['foto']['tmp_name'], $foto);
    }

    // Consulta preparada
    $sql = "UPDATE personal SET nombre=?, cargo=?, bio=?, email=?, telefono=?, direccion=?, foto=IFNULL(?, foto) WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssi', $nombre, $cargo, $bio, $email, $telefono, $direccion, $foto, $id);

    if ($stmt->execute()) {
        if ($servicio_id !== null) {
            $sql = "DELETE FROM personal_servicios WHERE personal_id=?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $sql = "INSERT INTO personal_servicios (personal_id, servicio_id) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('ii', $id, $servicio_id);
            $stmt->execute();
        }
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al editar el personal: " . $stmt->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
