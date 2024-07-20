<?php
include 'conectar.php';

$id = $_GET['id'];

// Eliminar todos los servicios asociados a la categoría
$sql_servicios = "DELETE FROM servicios WHERE categoria = '$id'";
if (!mysqli_query($conn, $sql_servicios)) {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar los servicios asociados']);
    exit();
}

// Eliminar la categoría
$sql_categoria = "DELETE FROM categorias WHERE id = '$id'";
if (mysqli_query($conn, $sql_categoria)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar la categoría']);
}

mysqli_close($conn);
?>
