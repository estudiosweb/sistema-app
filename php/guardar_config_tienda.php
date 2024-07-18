<?php
include 'conectar.php';
include 'utilidades.php';

$nombreNegocio = sanitizeInput($_POST['nombreNegocio']);
$direccionNegocio = sanitizeInput($_POST['direccionNegocio']);
$telefonoNegocio = sanitizeInput($_POST['telefonoNegocio']);
$whatsappNegocio = sanitizeInput($_POST['whatsappNegocio']);
$logotipo = file_get_contents($_FILES['logotipo']['tmp_name']);
$response = array();

try {
    $sql = "SELECT * FROM configuracion_tienda LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $sql = "UPDATE configuracion_tienda SET nombre_negocio='$nombreNegocio', direccion_negocio='$direccionNegocio', telefono_negocio='$telefonoNegocio', whatsapp_negocio='$whatsappNegocio', logotipo='$logotipo' WHERE id=1";
    } else {
        $sql = "INSERT INTO configuracion_tienda (nombre_negocio, direccion_negocio, telefono_negocio, whatsapp_negocio, logotipo) VALUES ('$nombreNegocio', '$direccionNegocio', '$telefonoNegocio', '$whatsappNegocio', '$logotipo')";
    }

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Configuración guardada exitosamente';
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
