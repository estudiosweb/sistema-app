<?php
include 'conectar.php';

$nombreCategoria = $_POST['nombreCategoria'];

$sql = "INSERT INTO categorias (nombre) VALUES ('$nombreCategoria')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar la categoría']);
}

mysqli_close($conn);
?>
