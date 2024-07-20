<?php
include 'conectar.php';

$nombre = $_POST['nombre'];
$categoria = $_POST['categoria'];
$duracion = $_POST['duracion'];
$precio = $_POST['precio'];
$descripcion = $_POST['descripcion'];
$fotografia = isset($_FILES['fotografia']) ? $_FILES['fotografia'] : null;

$foto = "path/to/default/icon.png"; // Ruta del ícono por defecto

if ($fotografia && $fotografia['tmp_name']) {
    // Validar y manejar la carga de la imagen
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($fotografia["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($fotografia["tmp_name"]);
    if($check !== false) {
        if (move_uploaded_file($fotografia["tmp_name"], $target_file)) {
            $foto = $target_file;
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
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar el servicio']);
}

mysqli_close($conn);
?>
