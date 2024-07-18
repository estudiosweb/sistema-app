<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM horarios";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $horarios = array();
        while($row = $result->fetch_assoc()) {
            $horarios[] = $row;
        }
        $response['status'] = 'success';
        $response['horarios'] = $horarios;
    } else {
        $response['status'] = 'success';
        $response['horarios'] = [];
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
