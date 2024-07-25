<?php
include 'conectar.php';

$nombre = $_POST['nombre'];
$categoria = $_POST['categoria'];
$duracion = $_POST['duracion'];
$precio = $_POST['precio'];
$descripcion = $_POST['descripcion'];
$fotografia = isset($_FILES['fotografia']) ? $_FILES['fotografia'] : null;

$foto = "images/servicios/servicio-nn.png"; // Ruta de la imagen por defecto

if ($fotografia && $fotografia['tmp_name']) {
    // Validar y manejar la carga de la imagen
    $target_dir = "../images/servicios/"; // Asegúrate de que el directorio exista
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $target_file = $target_dir . basename($fotografia["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Comprobar si el archivo es una imagen real
    $check = getimagesize($fotografia["tmp_name"]);
    if ($check !== false) {
        // Comprobar el tamaño del archivo (límite de 5MB)
        if ($fotografia["size"] > 5000000) {
            echo json_encode(['status' => 'error', 'message' => 'El archivo es demasiado grande']);
            exit();
        }
        // Permitir ciertos formatos de archivo
        $allowed_formats = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($imageFileType, $allowed_formats)) {
            echo json_encode(['status' => 'error', 'message' => 'Solo se permiten formatos JPG, JPEG, PNG y GIF']);
            exit();
        }
        if (move_uploaded_file($fotografia["tmp_name"], $target_file)) {
            $foto = "../images/servicios/" . basename($fotografia["name"]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al subir la imagen']);
            exit();
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'El archivo no es una imagen']);
        exit();
    }
}

$sql = "INSERT INTO servicios (nombre, categoria, duracion, precio, descripcion, imagen) 
        VALUES ('$nombre', '$categoria', '$duracion', '$precio', '$descripcion', '$foto')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar el servicio: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
