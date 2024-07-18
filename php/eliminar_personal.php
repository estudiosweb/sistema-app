<?php
include 'conectar.php';

$id = intval($_GET['id']);
$response = array();

try {
    $sql = "DELETE FROM personal WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
