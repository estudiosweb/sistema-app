<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'conectar.php';

$response = array();

try {
    $nombre_negocio = $_POST['nombre_negocio'];
    $direccion_negocio = $_POST['direccion_negocio'];
    $telefono_negocio = $_POST['telefono_negocio'];
    $whatsapp_negocio = $_POST['whatsapp_negocio'];
    $logotipo = '';

    // Verificar si se subió un archivo y si es una imagen válida
    if (isset($_FILES['logotipo']) && $_FILES['logotipo']['error'] === UPLOAD_ERR_OK) {
        $file_tmp = $_FILES['logotipo']['tmp_name'];
        $file_name = basename($_FILES['logotipo']['name']);
        $file_type = mime_content_type($file_tmp);

        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file_type, $allowed_types)) {
            throw new Exception("Solo se permiten archivos de imagen (JPEG, PNG, GIF).");
        }

        $logotipo = 'uploads/' . $file_name;
        if (!move_uploaded_file($file_tmp, $logotipo)) {
            throw new Exception("Error al mover el archivo subido.");
        }
    }

    $sql = "UPDATE configuracion SET nombre_negocio='$nombre_negocio', direccion_negocio='$direccion_negocio', telefono_negocio='$telefono_negocio', whatsapp_negocio='$whatsapp_negocio'";

    if ($logotipo) {
        $sql .= ", logotipo='$logotipo'";
    }

    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error al actualizar la configuración de la tienda: " . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
