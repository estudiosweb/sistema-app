<?php
include 'conectar.php';

$response = array();

try {
    $sql = "SELECT * FROM personal";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $response['status'] = 'success';
        $response['personal'] = array();
        while ($row = $result->fetch_assoc()) {
            $response['personal'][] = $row;
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'No se encontró personal.';
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
