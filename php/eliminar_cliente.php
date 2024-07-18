<?php
include 'conectar.php';

$id = $_POST['id'];

$response = array();

try {
    $sql = "DELETE FROM clientes WHERE id='$id'";
    if ($conn->query($sql) === TRUE) {
        $response['status'] = 'success';
        $response['message'] = 'Cliente eliminado exitosamente';
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
