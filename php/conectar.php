<?php
$servername = "localhost"; 
$username = "root"; 
$password = "mysql";
$dbname = "salon_belleza";

$response = array();

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Conexión fallida: " . $conn->connect_error);
    }
} catch (Exception $e) {
    $response['status'] = 'error';
    $response['message'] = $e->getMessage();
    echo json_encode($response);
    exit;
}
?>
