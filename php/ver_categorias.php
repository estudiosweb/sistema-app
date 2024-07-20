<?php
include 'conectar.php';

$sql = "SELECT * FROM categorias";
$result = mysqli_query($conn, $sql);

$categorias = [];

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $categorias[] = $row;
    }
    echo json_encode(['status' => 'success', 'categorias' => $categorias]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No hay categorías disponibles']);
}

mysqli_close($conn);
?>
