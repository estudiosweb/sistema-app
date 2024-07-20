<?php
include 'conectar.php';

$response = array();

try {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql = "SELECT * FROM horarios WHERE id='$id'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['horario'] = $result->fetch_assoc();
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Horario no encontrado';
        }
    } else {
        $sql = "SELECT * FROM horarios";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['horarios'] = array();
            while($row = $result->fetch_assoc()) {
                $response['horarios'][] = $row;
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'No se encontraron horarios';
        }
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
