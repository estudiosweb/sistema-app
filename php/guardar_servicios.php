<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include 'conectar.php';
$response = array();

$uploadFileDir = 'images/';
if (!is_dir($uploadFileDir)) {
    if (!mkdir($uploadFileDir, 0755, true)) {
        $response['status'] = 'error';
        $response['message'] = 'No se pudo crear el directorio de destino para las imágenes.';
        echo json_encode($response);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $nombre = $_POST['nombre'];
    $categoria = $_POST['categoria'];
    $duracion = $_POST['duracion'];
    $precio = $_POST['precio'];
    $descripcion = $_POST['descripcion'];
    $imagen = null;

    // Validación de precio
    if (!is_numeric($precio) || $precio < 0 || $precio > 999999.99) {
        $response['status'] = 'error';
        $response['message'] = 'El precio debe ser un valor numérico entre 0 y 999999.99';
        echo json_encode($response);
        exit;
    }

    // Manejo del archivo de imagen
    if (isset($_FILES['fotografia']) && $_FILES['fotografia']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['fotografia']['tmp_name'];
        $fileName = $_FILES['fotografia']['name'];
        $fileSize = $_FILES['fotografia']['size'];
        $fileType = $_FILES['fotografia']['type'];
        $fileNameCmps = explode(".", $fileName);
        $fileExtension = strtolower(end($fileNameCmps));

        // Limpiar el nombre del archivo y asegurarse de que sea único
        $newFileName = uniqid() . '.' . $fileExtension;

        // Verificar si la extensión del archivo es permitida
        $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');
        if (in_array($fileExtension, $allowedfileExtensions)) {
            // Directorio donde se guardará la imagen
            $dest_path = $uploadFileDir . $newFileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                // Verificación de que el archivo existe en el servidor
                if (file_exists($dest_path)) {
                    $imagen = $newFileName;
                } else {
                    $response['status'] = 'error';
                    $response['message'] = 'Hubo un error moviendo el archivo a su ubicación final.';
                    echo json_encode($response);
                    exit;
                }
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Hubo un error moviendo el archivo a su ubicación final.';
                echo json_encode($response);
                exit;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Tipo de archivo no permitido.';
            echo json_encode($response);
            exit;
        }
    }

    if ($id) {
        // Actualizar el servicio existente
        if ($imagen) {
            // Eliminar la imagen antigua
            $sql = "SELECT imagen FROM servicios WHERE id = ?";
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $stmt->bind_result($oldImagen);
                $stmt->fetch();
                if ($oldImagen && file_exists($uploadFileDir . $oldImagen)) {
                    unlink($uploadFileDir . $oldImagen);
                }
                $stmt->close();
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Error al preparar la consulta SQL para obtener la imagen antigua: ' . $conn->error;
                echo json_encode($response);
                exit;
            }

            $query = "UPDATE servicios SET nombre = ?, categoria = ?, duracion = ?, precio = ?, descripcion = ?, imagen = ? WHERE id = ?";
            if (!$stmt = $conn->prepare($query)) {
                $response['status'] = 'error';
                $response['message'] = 'Error al preparar la consulta SQL para actualizar el servicio: ' . $conn->error;
                echo json_encode($response);
                exit;
            }
            $stmt->bind_param("siidssi", $nombre, $categoria, $duracion, $precio, $descripcion, $imagen, $id);
        } else {
            $query = "UPDATE servicios SET nombre = ?, categoria = ?, duracion = ?, precio = ?, descripcion = ? WHERE id = ?";
            if (!$stmt = $conn->prepare($query)) {
                $response['status'] = 'error';
                $response['message'] = 'Error al preparar la consulta SQL para actualizar el servicio: ' . $conn->error;
                echo json_encode($response);
                exit;
            }
            $stmt->bind_param("siidssi", $nombre, $categoria, $duracion, $precio, $descripcion, $id);
        }
    } else {
        // Insertar un nuevo servicio
        $query = "INSERT INTO servicios (nombre, categoria, duracion, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?)";
        if (!$stmt = $conn->prepare($query)) {
            $response['status'] = 'error';
            $response['message'] = 'Error al preparar la consulta SQL para insertar un nuevo servicio: ' . $conn->error;
            echo json_encode($response);
            exit;
        }
        $stmt->bind_param("siidss", $nombre, $categoria, $duracion, $precio, $descripcion, $imagen);
    }

    if ($stmt->execute()) {
        $response['status'] = 'success';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Error al guardar el servicio: ' . $stmt->error;
    }
    $stmt->close();
    $conn->close();
} else {
    $response['status'] = 'error';
    $response['message'] = 'Método de solicitud no permitido.';
}

echo json_encode($response);
?>
