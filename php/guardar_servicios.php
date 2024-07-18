<?php
include 'conectar.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->nombre) && isset($data->duracion) && isset($data->precio) && isset($data->categoria_id)) {
    $nombre = $data->nombre;
    $categoria = $data->categoria;
    $duracion = $data->duracion;
    $precio = $data->precio;
    $descripcion = isset($data->descripcion) ? $data->descripcion : '';
    $categoria_id = $data->categoria_id;

    $sql = "INSERT INTO servicios (nombre, categoria, duracion, precio, descripcion, categoria_id) VALUES ('$nombre', '$categoria', '$duracion', '$precio', '$descripcion', '$categoria_id')";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Servicio agregado exitosamente';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Error al agregar el servicio: ' . $conn->error;
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Datos del servicio no proporcionados';
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
